// src/pages/LoginPage.js
import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Container,
  TextField,
  Button,
  Box,
} from "@mui/material";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //   const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Login Attempted with:", { username, password });

    // DUMMY FOR NOW
    alert("Login successful! (Dummy Login)");
    navigate("/dashboard");

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

          {/* Sign Up Button */}
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2">Don't have an account?</Typography>
            <Button
              variant="text"
              color="secondary"
              onClick={() => navigate("/register")} // Redirect to Register Page
            >
              Sign up
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
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
