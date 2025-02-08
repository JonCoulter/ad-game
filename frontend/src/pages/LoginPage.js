// src/pages/LoginPage.js
import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Container } from "@mui/material";
import InputField from "../components/InputField";
import Button from "../components/Button";

const LoginPage = () => {
  const { setUserId } = useAuth();
  const [inputId, setInputId] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (inputId.trim() !== "") {
      setUserId(inputId);
      navigate("/dashboard");
    } else {
      alert("Please enter a valid User ID.");
    }
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
          <Button text="Log In" onClick={handleLogin} />
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
