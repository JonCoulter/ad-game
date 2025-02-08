// src/pages/LandingPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
      {}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "80px",
          height: "80px",
          backgroundColor: "#d3d6da", // Placeholder background color
          borderRadius: "8px",
          mx: "auto",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          🔲
        </Typography>
      </Box>

      {/* Title */}
      <Typography variant="h3" fontWeight="bold">
        Ad Detector
      </Typography>

      {/* Subtitle */}
      <Typography variant="subtitle1" sx={{ mt: 1, mb: 4 }}>
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
        <Button variant="contained" sx={{ borderRadius: "24px", px: 4 }}>
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
