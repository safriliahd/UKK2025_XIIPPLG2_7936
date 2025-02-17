import React, { useState } from "react";
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { register } from "../../Store/endpoint/authEnd";

export default function RegisterPage() {
  const [user, setUser] = useState({ username: "", password: "", email: "", name: "" });
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });

    if (e.target.name === "password") {
      validatePassword(e.target.value);
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!minLength) {
      setPasswordError("Password must be at least 8 characters long.");
    } else if (!hasUppercase) {
      setPasswordError("Password must contain at least one uppercase letter.");
    } else if (!hasNumber) {
      setPasswordError("Password must contain at least one number.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError) return; 
    try {
      const response = await register(user);
      console.log("Registration successful", response);
      setError("");
      setOpenDialog(true);
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate("/");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
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
            label="Email"
            name="email"
            type="email"
            margin="normal"
            variant="outlined"
            value={user.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Name"
            name="name"
            margin="normal"
            variant="outlined"
            value={user.name}
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
            error={!!passwordError}
            helperText={passwordError}
          />
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ mt: 2 }}
            disabled={!!passwordError} 
          >
            Register
          </Button>
          <Typography 
            variant="body2" 
            align="center" 
            sx={{ mt: 1, cursor: "pointer" }} 
            onClick={() => navigate("/")}
          > 
            Already have an account?{" "}
            <Typography component="span" color="primary" sx={{ cursor: "pointer" }}>
              Sign In
            </Typography>
          </Typography>
        </Box>
      </Paper>

      {/* Dialog Registrasi Berhasil */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Registration Successful</DialogTitle>
        <DialogContent>
          <Typography>Your account has been created successfully. You can now sign in.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
