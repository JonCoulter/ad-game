// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BlitzGame from "./pages/BlitzGame";
import Dashboard from "./pages/Dashboard";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
} from "@mui/material";

// Create a theme
const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/BlitzGame" element={<BlitzGame />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
