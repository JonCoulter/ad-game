// src/pages/Dashboard.js
import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
} from "@mui/material";
import Button from "../components/Button";

const Dashboard = () => {
  const { userId, setUserId } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserId(null);
    navigate("/");
  };
  const projects = [
    { name: "Project A", status: "Running" },
    { name: "Project B", status: "Completed" },
    { name: "Project C", status: "Pending" },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {userId}!
      </Typography>
      <Typography variant="subtitle1">Here are your projects:</Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow key={index}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3 }}>
        <Button text="Log Out" onClick={handleLogout} color="secondary" />
      </Box>
    </Container>
  );
};

export default Dashboard;
