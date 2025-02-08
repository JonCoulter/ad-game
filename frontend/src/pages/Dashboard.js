import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Modal,
  Button,
  TextField,
  Paper,
  Container,
  Card,
  Divider,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; 
import DeleteIcon from "@mui/icons-material/Delete"; // Importing Add icon

import ButtonCustom from "../components/Button";
import CloseIcon from "@mui/icons-material/Close"; // Import Close icon for modal

const Dashboard = () => {
  const { userId, setUserId } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For Create Project Modal
  const [newProjectName, setNewProjectName] = useState("");
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);

  // For Project Details Modal
  const [selectedProject, setSelectedProject] = useState(null);
  const [openProjectModal, setOpenProjectModal] = useState(false);

  // For Upload Ad Modal
  const [adName, setAdName] = useState("");
  const [adFile, setAdFile] = useState(null);
  const [openUploadAdModal, setOpenUploadAdModal] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate("/login"); // Redirect if user is not logged in
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/get_user_data",
          {
            method: "POST", // Use POST instead of GET
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: userId }), // Send user_id in the request body
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUsername(data.username || "");
        setProjects(data.projects || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleLogout = () => {
    setUserId(null);
    navigate("/");
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      alert("Please enter a project name.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/create_project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, project_name: newProjectName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      // Refresh the project list
      const data = await response.json();
      setProjects((prevProjects) => [
        { project_name: newProjectName, ads: [] }, // Add new project to the list
        ...prevProjects,
      ]);
      setOpenCreateProjectModal(false); // Close modal
      setNewProjectName(""); // Reset project name field
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUploadAd = async () => {
    if (!adName.trim() || !adFile) {
      alert("Please enter an ad name and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", adFile);
    formData.append("user_id", userId);
    formData.append("project_id", selectedProject.project_id);
    formData.append("ad_name", adName);

    try {
      const response = await fetch("http://localhost:5000/api/upload_ad", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload ad");
      }

      const data = await response.json();

      // Add the new ad to the selected project's ads array
      const updatedProject = {
        ...selectedProject,
        ads: [
          ...selectedProject.ads,
          { ad_name: adName, filepath: data.file_url },
        ],
      };

      // Update the projects state by modifying the selected project with the new ad
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.project_id === selectedProject.project_id
            ? updatedProject
            : project
        )
      );

      // Close the modal and reset the input fields
      setOpenUploadAdModal(false);
      setAdName("");
      setAdFile(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteAd = async (adId) => {
    try {
      const response = await fetch("http://localhost:5000/api/delete_ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          project_id: selectedProject.project_id,
          ad_id: adId, // Pass the ad_id to be deleted
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete ad");
      }
  
      // Remove the ad from the selected project ads list in the state
      setSelectedProject((prevProject) => ({
        ...prevProject,
        ads: prevProject.ads.filter((ad) => ad.ad_id !== adId),
      }));
  
      // Optionally, you can remove the ad from the main projects list as well
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.project_id === selectedProject.project_id
            ? {
                ...project,
                ads: project.ads.filter((ad) => ad.ad_id !== adId),
              }
            : project
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Error: {error}
      </Typography>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Grid Item for Welcome Text */}
        <Grid item xs={10}>
          <Typography variant="h4" sx={{ fontSize: "2rem" }} gutterBottom>
            Welcome, {username}!
          </Typography>
        </Grid>

        {/* Grid Item for Logout Button */}
        <Grid item xs={2} sx={{ textAlign: "right" }}>
          <ButtonCustom
            text="Log Out"
            onClick={handleLogout}
            color="secondary"
            variant="outlined"
            sx={{
              padding: "4px 10px", // Smaller padding
              fontWeight: 600,
              fontSize: "0.8rem", // Reduced font size
              boxShadow: 2,
              borderRadius: "20px",
              "&:hover": {
                backgroundColor: "secondary.light",
              },
            }}
          />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Here are your projects:
      </Typography>

      {/* Grid for Projects */}
      <Grid container spacing={3}>
        {/* Create Project Button styled as a project card */}
        <Grid item xs={12} sm={6} md={4}>
          {/* Create Project Button styled as a project card */}
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              borderRadius: 2,
              boxShadow: 2,
              cursor: "pointer", // Make it a pointer on hover
              height: "100%", // Full height
              backgroundColor: "primary.main",
              color: "white",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 6,
              },
            }}
            onClick={() => setOpenCreateProjectModal(true)}
          >
            <AddIcon sx={{ fontSize: 40 }} />
            <Typography variant="body1">Create Project</Typography>
          </Card>
        </Grid>

        {projects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Center horizontally
                justifyContent: "center", // Center vertically
                padding: 2,
                borderRadius: 2,
                boxShadow: 2,
                cursor: "pointer", // Make it a pointer on hover
                height: "100%", // Full height
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
              onClick={() => {
                setSelectedProject(project);
                setOpenProjectModal(true);
              }}
            >
              <Typography variant="h6" align="center">
                {project.project_name}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Project Modal */}
      <Modal
        open={openCreateProjectModal}
        onClose={() => setOpenCreateProjectModal(false)}
        aria-labelledby="create-project-modal"
        aria-describedby="create-project-modal-description"
      >
        <Box
          sx={{
            p: 4,
            backgroundColor: "white",
            borderRadius: 2,
            maxWidth: 400,
            margin: "auto",
            mt: 5,
            boxShadow: 6,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Create a New Project
          </Typography>
          <TextField
            label="Project Name"
            variant="outlined"
            fullWidth
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreateProject}
          >
            Create Project
          </Button>
        </Box>
      </Modal>

      {/* Project Details Modal */}
{/* Project Details Modal */}
<Modal
  open={openProjectModal}
  onClose={() => setOpenProjectModal(false)} // This will still allow closing by clicking outside
  aria-labelledby="project-details-modal"
  aria-describedby="project-details-modal-description"
>
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh", // Ensure it takes full height to enable background clicks
      backdropFilter: "blur(4px)", // Keeps the blur effect for background
    }}
  >
    <Card
      sx={{
        p: 3,
        backgroundColor: "#fff",
        borderRadius: 3,
        maxWidth: 600,
        width: "100%",
        boxShadow: 24,
        position: "relative", // To position the close button
      }}
    >
      {/* Close Button in the top-right corner */}
      <IconButton
        onClick={() => setOpenProjectModal(false)} // Close the modal when clicked
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          color: "text.secondary",
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography
        variant="h4"
        sx={{ fontWeight: 600, color: "primary.main" }}
        gutterBottom
      >
        {selectedProject?.project_name}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          Ads
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Display Ads and Analytics */}
        {selectedProject?.ads?.length > 0 ? (
          selectedProject.ads.map((ad, index) => (
            <Card
              key={index}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: "background.default",
                borderRadius: 2,
                boxShadow: 2,
                display: "flex", // Ensure it aligns content horizontally
                justifyContent: "space-between", // Space between the text and the delete button
                alignItems: "center",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {ad.ad_name}
                </Typography>

                {/* Correct and Incorrect Guesses */}
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Correct Guesses: {ad.correct_guesses || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Incorrect Guesses: {ad.incorrect_guesses || 0}
                  </Typography>
                </Box>
              </Box>

              {/* Delete Icon */}
              <IconButton
                color="error"
                onClick={() => handleDeleteAd(ad.ad_id)} // Pass ad_id to delete
                sx={{
                  marginLeft: "auto", // Align the delete icon to the right
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Card>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No ads uploaded yet for this project.
          </Typography>
        )}
      </Box>

      {/* Upload Ad Button */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: 600,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
          onClick={() => setOpenUploadAdModal(true)}
        >
          Upload Ad
        </Button>
      </Box>
    </Card>
  </Box>
</Modal>



      {/* Upload Ad Modal */}
      <Modal
        open={openUploadAdModal}
        onClose={() => setOpenUploadAdModal(false)}
        aria-labelledby="upload-ad-modal"
        aria-describedby="upload-ad-modal-description"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh", // Ensure it takes full height to enable background clicks
            backdropFilter: "blur(4px)", // Keeps the blur effect for background
          }}
        >
          <Card
            sx={{
              p: 3,
              backgroundColor: "#fff",
              borderRadius: 3,
              maxWidth: 600,
              width: "100%",
              boxShadow: 24,
              position: "relative", // To position the close button if necessary
            }}
          >
            {/* Close Button in the top-right corner */}
            <IconButton
              onClick={() => setOpenUploadAdModal(false)} // Close the modal when clicked
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                color: "text.secondary",
              }}
            >
              <CloseIcon />
            </IconButton>

            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: "primary.main" }}
              gutterBottom
            >
              Upload an Ad
            </Typography>

            <TextField
              label="Ad Name"
              variant="outlined"
              fullWidth
              value={adName}
              onChange={(e) => setAdName(e.target.value)}
              sx={{ mb: 3 }} // Add some margin for spacing
            />

            <input
              type="file"
              onChange={(e) => setAdFile(e.target.files[0])}
              accept="video/mp4"
              style={{ marginTop: 8, width: "100%" }} // Make sure it stretches across the modal width
            />

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleUploadAd}
                sx={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                Upload Ad
              </Button>
            </Box>
          </Card>
        </Box>
      </Modal>
    </Container>
  );
};

export default Dashboard;
