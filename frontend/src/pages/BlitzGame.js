import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const videoData = [
  { url: "https://www.w3schools.com/html/mov_bbb.mp4", type: "real" },
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
      <Typography variant="h4" fontWeight="bold">
        Blitz Mode
      </Typography>
      <Typography variant="h6">Time Left: {timer}s</Typography>
      <Typography variant="h6">Score: {score}</Typography>

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
                height: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <video
                src={videoData[currentIndex].url}
                controls
                autoPlay
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </motion.div>
          </AnimatePresence>
        </Box>
      )}
    </Container>
  );
};

export default BlitzGame;
