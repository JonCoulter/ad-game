// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
} from "@mui/material";
import LandingPage from "./pages/LandingPage";

// Create a theme
const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;
