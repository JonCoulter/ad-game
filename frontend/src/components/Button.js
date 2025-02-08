import React from "react";
import { Button as MUIButton } from "@mui/material";

const Button = ({
  text,
  onClick,
  variant = "contained",
  color = "primary",
}) => {
  return (
    <MUIButton
      variant={variant}
      color={color}
      onClick={onClick}
      sx={{ mt: 2, width: "100%" }}
    >
      {text}
    </MUIButton>
  );
};

export default Button;
