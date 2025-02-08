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
} from "@mui/material";

import ButtonCustom from "../components/Button";

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
        ...prevProjects,
        { project_name: newProjectName, ads: [] },
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
      // Add new ad to the selected project
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.project_id === selectedProject.project_id
            ? {
                ...project,
                ads: [
                  ...project.ads,
                  { ad_name: adName, filepath: data.file_url },
                ],
              }
            : project
        )
      );
      setOpenUploadAdModal(false);
      setAdName("");
      setAdFile(null);
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
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {username}!
      </Typography>
      <Typography variant="subtitle1">Here are your projects:</Typography>

      <Box sx={{ mt: 3, mb: 2 }}>
        <ButtonCustom
          text="Create Project"
          onClick={() => setOpenCreateProjectModal(true)}
          color="primary"
        />
      </Box>

      {/* Grid for Projects */}
      <Grid container spacing={2}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} key={project.project_id}>
            <Paper
              sx={{
                padding: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">{project.project_name}</Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setSelectedProject(project);
                  setOpenProjectModal(true);
                }}
              >
                View Details
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <ButtonCustom text="Log Out" onClick={handleLogout} color="secondary" />
      </Box>

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
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateProject}
            >
              Create Project
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openProjectModal}
        onClose={() => setOpenProjectModal(false)} // Handles closing the modal when clicking outside
        aria-labelledby="project-details-modal"
        aria-describedby="project-details-modal-description"
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjusts the backdrop opacity
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backdropFilter: "blur(4px)",
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
            }}
          >
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
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {ad.ad_name}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Correct Guesses: {ad.correct_guesses || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Incorrect Guesses: {ad.incorrect_guesses || 0}
                      </Typography>
                    </Box>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No ads uploaded yet for this project.
                </Typography>
              )}
            </Box>

            {/* Upload Ad Button */}
            <Box
              sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}
            >
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
            p: 4,
            backgroundColor: "white",
            borderRadius: 2,
            maxWidth: 400,
            margin: "auto",
            mt: 5,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Upload an Ad
          </Typography>
          <TextField
            label="Ad Name"
            variant="outlined"
            fullWidth
            value={adName}
            onChange={(e) => setAdName(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setAdFile(e.target.files[0])}
            accept="video/mp4"
            style={{ marginTop: 8 }}
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUploadAd}
            >
              Upload Ad
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Dashboard;
