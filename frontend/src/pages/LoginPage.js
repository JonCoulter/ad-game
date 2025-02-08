// src/pages/LoginPage.js
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

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Login Attempted with:", { username, password });

    if (username.trim() === "" || password.trim() === "") {
      alert("Please enter a valid username and password.");
      return;
    }

    // TODO: Implement authentication later
    alert("Login successful! (Dummy Login)");

    // Navigate to dashboard (or wherever the next page is)
    navigate("/dashboard");
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            Log In
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

          {/* Login Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            Log in
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
