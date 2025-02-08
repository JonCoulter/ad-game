import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
// import BlitzLogo from "../assets/blitz-logo-removebg-preview.png";
import logo from "../assets/LOGO.png";


const BlitzGame = () => {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(5);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const fetchRandomVideo = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/get_random_video"
      );
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

  useEffect(() => {
    fetchRandomVideo();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setIsGameOver(true);
    }
  }, [timer]);

  const handleSwipe = useCallback(
    (direction) => {
      if (isGameOver || !currentVideo) return;

      const isCorrect =
        (direction === "right" && currentVideo.type === "real_video") ||
        (direction === "left" && currentVideo.type === "ad");

      setSwipeDirection(direction);

      setTimeout(() => {
        setScore((prev) => prev + (isCorrect ? 1 : -1));
        fetchRandomVideo();
        setSwipeDirection(null);
      }, 300);
    },
    [currentVideo, isGameOver]
  );

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

  const restartGame = () => {
    setScore(0);
    setTimer(60);
    setIsGameOver(false);
    fetchRandomVideo();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "99%",
        position: "relative",
        paddingTop: "20px",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        <img
          src={logo}
          alt="Blitz Logo"
          style={{ width: "200px", height: "auto" }}
        />
      </Box>

      {/* Game Over Screen */}
      {isGameOver ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0,0,0,0.8)",
            padding: "20px",
            borderRadius: "16px",
            textAlign: "center",
            zIndex: 5,
          }}
        >
          <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
            Game Over
          </Typography>
          <Typography variant="h5" sx={{ color: "#FFD700", marginTop: "10px" }}>
            Your Score: {score}
          </Typography>
          <Button
            variant="contained"
            sx={{
              marginTop: "15px",
              backgroundColor: "#007FFF",
              color: "white",
              "&:hover": { backgroundColor: "#005FCC" },
            }}
            onClick={restartGame}
          >
            Play Again
          </Button>
        </Box>
      ) : (
        <>
          {/* Timer & Score */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "500px",
              marginTop: "100px",
              zIndex: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontSize: "28x", fontWeight: "bold", color: "#007FFF" }}
            >
              {String(Math.floor(timer / 60)).padStart(2, "0")}:
              {String(timer % 60).padStart(2, "0")}
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontSize: "28px", fontWeight: "bold", color: "#FF5722" }}
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
              zIndex: 2,
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
                    zIndex: 3,
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
                      fetchRandomVideo();
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
              fontFamily: "LogoFont, sans-serif",
              position: "absolute",
              left: "35px",
              color: "red",
              fontWeight: "normal",
              padding: "8px 16px",
              borderRadius: "12px",
              zIndex: 2,
            }}
          >
            ⬅️ ad
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "LogoFont, sans-serif",
              position: "absolute",
              right: "35px",
              color: "green",
              fontWeight: "normal",
              padding: "8px 16px",
              borderRadius: "12px",
              zIndex: 2,
            }}
          >
            real ➡️
          </Typography>
        </>
      )}
    </Box>
  );
};

export default BlitzGame;