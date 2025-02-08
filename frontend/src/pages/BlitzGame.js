import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import BlitzLogo from "../assets/blitz-logo-removebg-preview.png";
import LocalVideo from "../assets/ad-59.mp4";

const videoData = [
  { url: LocalVideo, type: "real" },
  { url: "https://www.w3schools.com/html/movie.mp4", type: "ad" },
];

const BlitzGame = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setIsGameOver(true);
    }
  }, [timer]);

  // Handle swipe logic
  const handleSwipe = useCallback(
    (direction) => {
      if (isGameOver) return;

      const currentVideo = videoData[currentIndex];
      const isCorrect =
        (direction === "right" && currentVideo.type === "real") ||
        (direction === "left" && currentVideo.type === "ad");

      setSwipeDirection(direction); // Trigger animation

      setTimeout(() => {
        setScore((prev) => prev + (isCorrect ? 1 : -1));
        setCurrentIndex((prev) => (prev + 1) % videoData.length);
        setSwipeDirection(null); // Reset animation
      }, 300);
    },
    [currentIndex, isGameOver] // Dependencies
  );

  // Handle key presses for left/right
  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "ArrowRight") {
        handleSwipe("right");
      } else if (event.key === "ArrowLeft") {
        handleSwipe("left");
      }
    },
    [handleSwipe] // ✅ Add handleSwipe as a dependency
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        position: "relative",
        paddingTop: "20px",
      }}
    >
      {/* Logo - Stays at the Top */}
      <Box
        sx={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <img
          src={BlitzLogo}
          alt="Blitz Logo"
          style={{ width: "400px", height: "auto" }}
        />
      </Box>

      {/* === TIMER & SCORE ABOVE THE VIDEO === */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "500px", // Align with video size
          marginTop: "100px", // Moves it above the video
          zIndex: 3,
        }}
      >
        {/* Timer (Left) */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Press Start 2P', sans-serif",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#007FFF",
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Adds contrast
            padding: "6px 12px",
            borderRadius: "8px",
          }}
        >
          {String(Math.floor(timer / 60)).padStart(2, "0")}:
          {String(timer % 60).padStart(2, "0")}
        </Typography>

        {/* Score (Right) */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#FF5722",
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Adds contrast
            padding: "6px 12px",
            borderRadius: "8px",
          }}
        >
          {score}
        </Typography>
      </Box>

      {/* Video Box - Larger Size */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "500px", // Keeps video large
          aspectRatio: "9 / 16",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* AD & REAL Labels - Positioned Properly Outside Video */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "800px", // Ensures alignment with the video
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // Center align with video
            zIndex: 3, // Ensures labels appear above everything
            pointerEvents: "none", // Prevents interference with clicks
          }}
        >
          {/* Video */}
          <AnimatePresence>
            <motion.div
              key={currentIndex}
              initial={{ x: 0, opacity: 1 }}
              animate={{
                x:
                  swipeDirection === "left"
                    ? -400
                    : swipeDirection === "right"
                    ? 400
                    : 0,
                opacity: swipeDirection ? 0 : 1,
              }}
              transition={{ duration: 0.3 }}
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                zIndex: 1, // Ensures video stays behind
              }}
            >
              <video
                src={videoData[currentIndex]?.url}
                controls
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // Crop landscape videos to fit portrait
                  borderRadius: "16px",
                }}
                onError={(e) =>
                  console.error("Error loading video:", e.target.src)
                }
              />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      {/* AD Label (Left, Outside Video) */}
      <Typography
        variant="h4"
        sx={{
          position: "absolute",
          left: "35px", // Moves further left
          color: "red",
          opacity: 1,
          fontWeight: "bold",
          backgroundColor: "rgba(0, 0, 0, 0.8)", // Adds contrast
          padding: "8px 16px",
          borderRadius: "12px",
          whiteSpace: "nowrap", // Ensures text doesn’t break
        }}
      >
        ⬅️ AD
      </Typography>

      {/* REAL Label (Right, Outside Video) */}
      <Typography
        variant="h4"
        sx={{
          position: "absolute",
          right: "-10px", // Moves further right
          color: "green",
          opacity: 1,
          fontWeight: "bold",
          backgroundColor: "rgba(0, 0, 0, 0.8)", // Adds contrast
          padding: "8px 16px",
          borderRadius: "12px",
          whiteSpace: "nowrap", // Ensures text doesn’t break
        }}
      >
        REAL ➡️
      </Typography>
    </Box>
  );
};

export default BlitzGame;
