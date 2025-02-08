// src/components/InputField.js
import React from "react";
import { TextField } from "@mui/material";

const InputField = ({ label, value, onChange }) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      margin="normal"
      value={value}
      onChange={onChange}
    />
  );
};

export default InputField;
