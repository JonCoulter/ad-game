import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Container,
  TextField,
  Button,
  Box,
} from "@mui/material";

const LoginPage = () => {
  const { setUserId } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setUserId(data.user_id);
        navigate("/dashboard");
      } else {
        setLoginError(data.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Failed to connect to the server. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#75b3d0",
      }}
    >
      <Container maxWidth="xs">
        <Card sx={{ padding: 3, borderRadius: 4, textAlign: "center" }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontFamily: "LogoFont, sans-serif" }}
          >
            Log In
          </Typography>

          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            sx={{
              mt: 3,
              borderRadius: "24px",
              px: 4,
              py: 1.5,
              fontSize: "1.2rem",
              backgroundColor: "white",
              color: "#75b3d0",
              fontFamily: "'League Spartan', sans-serif",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
            onClick={handleLogin}
          >
            Log in
          </Button>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography
              variant="body1"
              sx={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              Don't have an account?
            </Typography>
            <Button
              variant="text"
              sx={{
                fontSize: "1.1rem",
                fontFamily: "'League Spartan', sans-serif",
                color: "white",
              }}
              onClick={() => navigate("/register")}
            >
              Sign up
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;

// USE THIS ONCE WE HAVE
// // src/pages/LoginPage.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../AuthContext";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Container,
//   TextField,
//   Button,
// } from "@mui/material";

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const { setUserId } = useAuth();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loginError, setLoginError] = useState("");

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     const response = await fetch("http://localhost:5000/api/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         action: "login",
//         username: username,
//         password: password,
//       }),
//     });
//     const data = await response.json();
//     if (data.status === "success") {
//       // Store user id in context
//       setUserId(data.userId);
//       // Redirect to dashboard
//       navigate("/dashboard");
//     } else {
//       setLoginError(data.message);
//     }
//   };
//   return (
//     <Container maxWidth="xs" sx={{ mt: 10 }}>
//       <Card>
//         <CardContent>
//           <Typography variant="h5" gutterBottom align="center">
//             Log In
//           </Typography>

//           {/* Username Field */}
//           <TextField
//             label="Username"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />

//           {/* Password Field */}
//           <TextField
//             label="Password"
//             type="password"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           {/* Login Button */}
//           <Button
//             variant="contained"
//             color="primary"
//             fullWidth
//             sx={{ mt: 2 }}
//             onClick={handleLogin}
//           >
//             Log in
//           </Button>
//         </CardContent>
//       </Card>
//     </Container>
//   );
// };

// export default LoginPage;
