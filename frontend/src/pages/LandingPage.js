// src/pages/LandingPage.js
import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";

const LandingPage = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
      {/* Logo (Placeholder for now, replace with an actual image if needed) */}
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
        Get 6 chances to detect if a video is an ad or not.
      </Typography>

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="outlined" sx={{ borderRadius: "24px", px: 4 }}>
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
