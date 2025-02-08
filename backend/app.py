import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import firestore, storage
from werkzeug.security import generate_password_hash, check_password_hash

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

# reference to the firestore users collection
users_collection = db.collection('users')
ads_collection = db.collection('ads')

# firestore and google cloud storage configuration
BUCKET_NAME = 'instagram-videos-bucket'


# -- ROUTES -- 

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
        'videos': [],
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




# To be implemented...

@app.route('/api/create_project', methods=['POST'])
def create_project():
    pass


@app.route('/api/upload_ad', methods=['POST'])
def upload_ad():
    pass


@app.route('/api/update_ad_data')
def update_add_data():
    pass



# -- END ROUTES --

if __name__ == '__main__':
    app.run(debug=True)