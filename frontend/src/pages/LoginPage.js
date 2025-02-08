// src/pages/LoginPage.js
import React, { useState } from "react";
import { useAuth } from "../AuthContext"; // ✅ Ensure correct path
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Button,
} from "@mui/material"; // ✅ Use MUI's Button
import InputField from "../components/InputField";

const LoginPage = () => {
  const { setUserId } = useAuth();
  const [inputId, setInputId] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("✅ Login button clicked!"); // Debugging log
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            Log In
          </Typography>
          <InputField
            label="Enter User ID"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
          />
          {/* ✅ Ensure handleLogin is passed correctly */}
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Log in
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
