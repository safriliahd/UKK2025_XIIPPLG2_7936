import React, { useState } from "react";
import { TextField, Button, Container, Typography, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../../Store/endpoint/authEnd";

export default function LoginPage() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(user);
      console.log("Login successful", response);
      setError("");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            variant="outlined"
            value={user.username}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            variant="outlined"
            value={user.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
        <Typography 
          variant="body2" 
          align="center" 
          sx={{ mt: 2, cursor: "pointer" }}
          onClick={() => navigate("/signUp")}
        >
          Don't have an account? <Typography component="span" color="primary" sx={{ cursor: "pointer" }}>Sign Up</Typography>
        </Typography>
      </Paper>
    </Container>
  );
}
