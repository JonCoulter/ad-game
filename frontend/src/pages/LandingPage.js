// src/pages/LandingPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import logo from "../assets/MainLogo.png"; // ✅ Correct import path

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
      {}
      <Box
  component="img"
  src= {logo}
  alt="AdVera Logo"
  sx={{
    width: "100px",  // Adjust size as needed
    height: "100px",
    mx: "auto",
    mb: 2,
  }}
/>

      {/* Title */}
      <Typography variant="h3" fontWeight="bold">
        AdVera
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
    color: "#333" 
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
