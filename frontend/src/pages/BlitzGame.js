import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import BlitzLogo from "../assets/blitz-logo-removebg-preview.png";

const BlitzGame = () => {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const fetchRandomVideo = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/get_random_video");
      const data = await response.json();

      if (data.signed_url) {
        setCurrentVideo({ url: data.signed_url, type: data.video_type });
      } else {
        console.error("No signed URL received.");
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  // Fetch the first video on component mount
  useEffect(() => {
    fetchRandomVideo();
  }, []);

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
      if (isGameOver || !currentVideo) return;

      const isCorrect =
        (direction === "right" && currentVideo.type === "real_video") ||
        (direction === "left" && currentVideo.type === "ad");

      setSwipeDirection(direction);

      setTimeout(() => {
        setScore((prev) => prev + (isCorrect ? 1 : -1));
        fetchRandomVideo(); // Fetch a new video after swiping
        setSwipeDirection(null);
      }, 300);
    },
    [currentVideo, isGameOver]
  );

  // Handle key presses for left/right
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowRight") {
        handleSwipe("right");
      } else if (event.key === "ArrowLeft") {
        handleSwipe("left");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleSwipe]);

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

      {/* Timer & Score */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "500px",
          marginTop: "100px",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontSize: "24px", fontWeight: "bold", color: "#007FFF" }}
        >
          {String(Math.floor(timer / 60)).padStart(2, "0")}:
          {String(timer % 60).padStart(2, "0")}
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontSize: "24px", fontWeight: "bold", color: "#FF5722" }}
        >
          {score}
        </Typography>
      </Box>

      {/* Video Box */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "500px",
          aspectRatio: "9 / 16",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <AnimatePresence>
          {currentVideo && (
            <motion.div
              key={currentVideo.url}
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
                zIndex: 1,
              }}
            >
              <video
                src={currentVideo.url}
                controls
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "16px",
                }}
                onError={(e) => {
                  console.error("Error loading video:", e.target.src);
                  fetchRandomVideo(); // Fetch another video if current one fails
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* AD & REAL Labels */}
      <Typography
        variant="h4"
        sx={{
          position: "absolute",
          left: "35px",
          color: "red",
          fontWeight: "bold",
          padding: "8px 16px",
          borderRadius: "12px",
        }}
      >
        ⬅️ AD
      </Typography>
      <Typography
        variant="h4"
        sx={{
          position: "absolute",
          right: "-10px",
          color: "green",
          fontWeight: "bold",
          padding: "8px 16px",
          borderRadius: "12px",
        }}
      >
        REAL ➡️
      </Typography>
    </Box>
  );
};

export default BlitzGame;
