import os
import random
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import timedelta
from google.auth.exceptions import DefaultCredentialsError
from google.cloud import firestore, storage
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

# load environment variables from .env file
load_dotenv()

# initialize flask app
app = Flask(__name__)
CORS(app)

# initialize firestore and cloud storage clients
db = firestore.Client()
storage_client = storage.Client()

# get the google cloud credentials from the environment variable
GOOGLE_APPLICATION_CREDENTIALS = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

# reference to the firestore collections
users_collection = db.collection('users')
ads_collection = db.collection('ads')
projects_collection = db.collection('projects')

# firestore and google cloud storage configuration
BUCKET_NAME = 'instagram-video-bucket'
ALLOWED_EXTENSIONS = ['mp4']


# -- START FUNCTIONS --

def allowed_file(filename):
    """Check if the uploaded file is an allowed type (mp4)."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_file_to_gcs(file, filename):
    """Upload the file to Google Cloud Storage."""
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(f"ads/{filename}")
    blob.upload_from_file(file)
    return blob.public_url

def delete_file_from_gcs(file_url):
    """Deletes the ad file from Google Cloud Storage (optional)."""
    try:
        # Extract the filename from the URL (assuming the file URL format)
        blob_name = file_url.split('/')[-1]
        bucket = storage_client.bucket(BUCKET_NAME)
        blob = bucket.blob(f"ads/{blob_name}")
        blob.delete()
    except Exception as e:
        print(f"Error deleting file from GCS: {str(e)}")

# -- END FUNCTIONS --


# -- START ROUTES -- 

# endpoint for user registration
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    # check if the user already exists
    existing_user = users_collection.where('username', '==', username).get()
    if existing_user:
        return jsonify({'error': 'User already exists'}), 400
    
    # hash the password before storing it
    hashed_password = generate_password_hash(password)
    
    # add user to db
    new_user = {
        'username': username,
        'password': hashed_password,
    }
    users_collection.add(new_user)
    
    return jsonify({'message': 'User registered successfully'}), 201


# endpoint for user login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    # check if the user exists in db
    user_ref = users_collection.where('username', '==', username).get()
    
    if not user_ref:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    user_data = user_ref[0].to_dict()
    
    # check password
    if not check_password_hash(user_data['password'], password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    return jsonify({'status': 'success', 'user_id': user_ref[0].id}), 200


@app.route('/api/get_random_video', methods=['GET'])
def get_random_video():
    # choose a random video type
    folders = ['ads', 'real_videos']
    folder = random.choice(folders)
    
    # get a random video filename
    all_videos = []
    bucket = storage_client.bucket(BUCKET_NAME)
    blobs = bucket.list_blobs(prefix=f'{folder}/')
    for blob in blobs:
        if blob.name.endswith('.mp4'):
            all_videos.append(blob.name)
    video_filename = random.choice(all_videos)
    
    # get video
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(f'{video_filename}')
    
    # make signed url for the video, expires in 10 mins
    signed_url = blob.generate_signed_url(
        expiration=timedelta(minutes=10),
        method='GET',
    )
    
    # get video type
    video_type = folder[:-1]
    
    return jsonify({'signed_url': signed_url, 'video_type': video_type, 'video_filename': video_filename})


@app.route('/api/create_project', methods=['POST'])
def create_project():
    # need frontend to make http request with user_id
    data = request.get_json()
    user_id = data.get('user_id')
    project_name = data.get('project_name')
    
    # check for a user_id
    if not user_id:
        return jsonify({'error': 'User ID required'}), 400
    
    # check if the user exists
    user_exists = users_collection.document(user_id)
    if not user_exists:
        return jsonify({'error': 'User does not exist'}), 400
    
    # check for a project name
    if not project_name:
        return jsonify({'error': 'Project name required'}), 400
    
    # add the new project to the db
    new_project = {
        'creator_id': user_id,
        'project_name': project_name,
        'ad_ids': [],
    }
    projects_collection.add(new_project)
    
    return jsonify({'status': 'success'}), 200


@app.route('/api/upload_ad', methods=['POST'])
def upload_ad():
    user_id = request.form.get('user_id')
    project_id = request.form.get('project_id')
    ad_name = request.form.get('ad_name')
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    
    if not ad_name:
        return jsonify({"error": "Ad name is required"}), 400
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        try:
            # save file to GCS
            file_url = upload_file_to_gcs(file, secure_filename(file.filename))

            # store the ad data in db
            ad_data = {
                'creator_id': user_id,
                'project_id': project_id,
                'ad_name': ad_name,
                'filepath': file_url,
                'correct_guesses': 0,
                'incorrect_guesses': 0,
                'timestamp': datetime.now(),
            }
            ad_ref = ads_collection.add(ad_data)
            
            # get the ad_id from the newly created ad
            ad_id = ad_ref[1].id
            
            # update the user's ad_ids array
            user_ref = users_collection.document(user_id)    
            user_ref.update({
                'ad_ids': firestore.ArrayUnion([ad_id])
            })
            
            # update the projects's ad_ids array
            project_ref = projects_collection.document(project_id)
            project_ref.update({
                'ad_ids': firestore.ArrayUnion([ad_id])
            })
            
            return jsonify({"message": "File uploaded successfully", "file_url": file_url}), 200
        except Exception as e:
            return jsonify({"error": f"Error uploading file: {str(e)}"}), 500
    else:
        return jsonify({"error": f"Invalid file type. Only files of type {ALLOWED_EXTENSIONS} are allowed."}), 400
    
    
@app.route('/api/get_user_data', methods=['POST'])
def get_user_data():
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    projects = []
    username = None
    
    # get the user's data (including username)
    user_ref = users_collection.document(user_id).get()
    
    if user_ref.exists:
        user_data = user_ref.to_dict()
        username = user_data.get('username')
    else:
        return jsonify({'error': 'User not found'}), 400
    
    # get the user's projects
    projects_ref = projects_collection.where("creator_id", "==", user_id).get()

    # for each project, retrieve the associated ads
    for project in projects_ref:
        project_data = project.to_dict()
        project_ads = []
        
        # retrieve all the ad_ids associated with this project
        ad_ids = project_data.get('ad_ids', [])
        
        # get ad data for each ad_id in this project
        for ad_id in ad_ids:
            ad_ref = ads_collection.document(ad_id).get()
            
            if ad_ref.exists:
                ad_data = ad_ref.to_dict()
                ad_data['ad_id'] = ad_id
                project_ads.append(ad_data)
        
        # add project data with ads
        projects.append({
            'project_name': project_data['project_name'],
            'project_id': project.id,
            'ads': project_ads,
        })
    
    return jsonify({'user_id': user_id, 'username': username, 'projects': projects}), 200


@app.route('/api/update_ad_data', methods=['POST'])
def update_ad_data():
    data = request.get_json()
    user_id = data.get('user_id')
    ad_id = data.get('ad_id')
    guess_type = data.get('guess_type')  # this will be either 'correct' or 'incorrect'

    if not user_id or not ad_id or not guess_type:
        return jsonify({'error': 'User ID, Ad ID, and Guess Type are required'}), 400

    if guess_type not in ['correct', 'incorrect']:
        return jsonify({'error': "Guess type must be either 'correct' or 'incorrect'"}), 400

    # get the ad document from db
    ad_ref = ads_collection.document(ad_id)
    ad_doc = ad_ref.get()

    if not ad_doc.exists:
        return jsonify({'error': 'Ad not found'}), 404

    ad_data = ad_doc.to_dict()
    
    # get the current number of correct or incorrect guesses
    if guess_type == 'correct':
        current_value = ad_data.get('correct_guesses', 0)
        new_value = current_value + 1
    else:  # 'incorrect'
        current_value = ad_data.get('incorrect_guesses', 0)
        new_value = current_value + 1

    # update the ad document with the incremented value
    ad_ref.update({
        f'{guess_type}_guesses': new_value
    })

    return jsonify({'status': 'success'}), 200


@app.route('/api/delete_ad', methods=['POST'])
def delete_ad():
    data = request.get_json()
    user_id = data.get('user_id')
    project_id = data.get('project_id')
    ad_id = data.get('ad_id')
    
    # Check if we have the required data
    if not user_id or not project_id or not ad_id:
        return jsonify({"error": "User ID, Project ID, and Ad ID are required"}), 400

    try:
        # 1. Delete the ad from the ads collection
        ad_ref = ads_collection.document(ad_id)
        ad_doc = ad_ref.get()
        
        if not ad_doc.exists:
            return jsonify({"error": "Ad not found"}), 404
        
        # Get the ad filepath for potential file deletion from Google Cloud Storage
        ad_data = ad_doc.to_dict()
        ad_filepath = ad_data.get('filepath')

        if ad_filepath:
            delete_file_from_gcs(ad_filepath)

        # Delete the ad from the ads collection
        ad_ref.delete()

        # 2. Remove the ad from the user's ad_ids array
        user_ref = users_collection.document(user_id)
        user_ref.update({
            'ad_ids': firestore.ArrayRemove([ad_id])
        })
        
        # 3. Remove the ad from the project's ad_ids array
        project_ref = projects_collection.document(project_id)
        project_ref.update({
            'ad_ids': firestore.ArrayRemove([ad_id])
        })
        
        return jsonify({"message": "Ad deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500






# -- END ROUTES --

# Debugging - Print all registered routes
print("Registered Routes:")
for rule in app.url_map.iter_rules():
    print(rule)
if __name__ == '__main__':
    app.run(debug=True)