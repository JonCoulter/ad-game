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
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <img
          src={BlitzLogo}
          alt="Blitz Logo"
          style={{ width: "350px", height: "auto" }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          px: 2,
          mt: 2,
        }}
      >
        {/* Timer (formatted as MM:SS) */}
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Press Start 2P', sans-serif", // Example font
            fontSize: "20px",
            fontWeight: "bold",
            color: "#007FFF",
          }}
        >
          Time Left: {String(Math.floor(timer / 60)).padStart(2, "0")}:
          {String(timer % 60).padStart(2, "0")}
        </Typography>

        {/* Score in Top Right */}
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Bebas Neue', sans-serif", // Example font
            fontSize: "24px",
            fontWeight: "bold",
            color: "#FF5722",
          }}
        >
          Score: {score}
        </Typography>
      </Box>

      {isGameOver ? (
        <>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Game Over!
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </>
      ) : (
        <Box sx={{ position: "relative", width: "100%", height: "500px" }}>
          <AnimatePresence>
            <motion.div
              key={currentIndex}
              initial={{ x: 0, opacity: 1 }}
              animate={{
                x:
                  swipeDirection === "left"
                    ? -300
                    : swipeDirection === "right"
                    ? 300
                    : 0,
                opacity: swipeDirection ? 0 : 1,
              }}
              transition={{ duration: 0.3 }}
              style={{
                width: "100%",
                aspectRatio: "9 / 16", // ✅ Forces 9:16 portrait mode
                borderRadius: "12px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <video
                src={videoData[currentIndex].url}
                controls
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // ✅ Ensures the video fills the frame
                  borderRadius: "12px",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </Box>
      )}
    </Container>
  );
};

export default BlitzGame;
