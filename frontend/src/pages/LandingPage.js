// src/pages/LandingPage.js
import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import logo from "../assets/LOGO.png";
import "../assets/fonts.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "80px",
          height: "80px",
          borderRadius: "8px",
          mx: "auto",
          mb: 2,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="AdVera Logo"
          sx={{
            width: "200px", // Adjust size as needed
            height: "150px",
            mx: "auto",
            mb: 2,
          }}
        />
      </Box>

      {/* Title */}
      <Typography
        variant="h3"
        sx={{
          fontFamily: "LogoFont, sans-serif",
          fontSize: "3rem",
          color: "#f6ffdd",
        }}
      >
        adVera
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="subtitle1"
        sx={{
          mt: 1,
          mb: 4,
          fontSize: "1.2rem", // Change font size
          fontWeight: "bold", // Change font weight
          fontFamily: "'League Spartan', sans-serif", // Use a custom font
          color: "#333",
        }}
      >
        Not everything is what it seems... can you spot the ads?
      </Typography>

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "24px", px: 4 }}
          onClick={() => navigate("/login")} // ✅ Correct navigation
        >
          Log in
        </Button>
        <Button
          variant="contained"
          sx={{ borderRadius: "24px", px: 4 }}
          onClick={() => navigate("/BlitzGame")}
        >
          Blitz
        </Button>
      </Box>
      {/* Footer */}
      <Typography
        variant="caption"
        sx={{ display: "block", mt: 4, color: "gray" }}
      >
        February 7, 2025
        <br />
        Tartan Hacks Submission
        <br />
      </Typography>
    </Container>
  );
};

export default LandingPage;
