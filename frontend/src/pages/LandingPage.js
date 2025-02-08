import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import logo from "../assets/LOGO.png";
import "../assets/fonts.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#75b3d0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 2, pt: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100px",
            height: "100px",
            borderRadius: "8px",
            mx: "auto",
            mb: 3,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="AdVera Logo"
            sx={{
              width: "250px", // Increased size
              height: "200px",
              mx: "auto",
              mb: 3,
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="h2"
          sx={{
            fontFamily: "LogoFont, sans-serif",
            fontSize: "4rem",
            color: "#f6ffdd",
          }}
        >
          adVera
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h5"
          sx={{
            mt: 2,
            mb: 5,
            fontSize: "1.5rem", // Increased size
            fontWeight: "bold",
            fontFamily: "'League Spartan', sans-serif",
            color: "#333",
          }}
        >
          Guess if a video is advertisement or regular content!
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "32px",
              px: 5,
              py: 1.5,
              fontSize: "1.2rem",
              color: "white",
              borderColor: "white",
              backgroundColor: "#75b3d0",
              fontFamily: "'League Spartan', sans-serif",
              "&:hover": {
                backgroundColor: "white",
                color: "#75b3d0",
              },
            }}
            onClick={() => navigate("/login")}
          >
            Log in
          </Button>
          <Button
            variant="contained"
            sx={{
              borderRadius: "32px",
              px: 5,
              py: 1.5,
              fontSize: "1.2rem",
              backgroundColor: "white",
              color: "#75b3d0",
              fontFamily: "'League Spartan', sans-serif",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
            onClick={() => navigate("/BlitzGame")}
          >
            Blitz
          </Button>
        </Box>
        {/* Footer */}
        <Typography
          variant="h6"
          sx={{ display: "block", mt: 5, color: "white" }}
        >
          February 8, 2025
          <br />
          Tartan Hacks Submission
          <br />
        </Typography>
      </Container>
    </Box>
  );
};

export default LandingPage;
