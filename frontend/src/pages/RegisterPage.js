// src/pages/RegisterPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Container,
  TextField,
  Button,
} from "@mui/material";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      alert("All fields are required!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // TODO: Store user data (dummy registration for now)
    alert("Registration successful! Now log in.");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            Sign Up
          </Typography>

          {/* Username Field */}
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Password Field */}
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Confirm Password Field */}
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* Register Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleRegister}
          >
            Sign Up
          </Button>

          {/* Go Back to Login */}
          <Button
            variant="text"
            color="secondary"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RegisterPage;
