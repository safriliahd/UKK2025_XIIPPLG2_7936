import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { register } from "../../Store/endpoint/authEnd";
import ImageTeal from "../../../public/imageTeal.jpg"
import { dark, light, teal } from "../../theme/color";

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
    <>
      <Grid container component='main' sx={{ height: '98vh' }}>
        <Grid
          item
          xs={false} sm={8} md={8}
          sx={{
            backgroundImage: `url(${ImageTeal})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <Grid
          item
          xs={12} sm={4} md={4}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 4,
            backgroundColor: teal[500],
          }}
        >
          <Typography variant="h5" align="center" gutterBottom sx={{color: light[100], fontWeight: 'bold'}}>
            Sign Up
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: 'white',
                  "&.Mui-focused": {
                    borderColor: 'white',
                  },
                },
                "& .MuiInputLabel-root": {
                  color: 'white',
                  "&.Mui-focused": {
                    color: 'white',
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: 'white',
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: 'white',
                },
              }}
              inputProps={{
                style: {
                  color: 'white',
                },
              }}
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: 'white',
                  "&.Mui-focused": {
                    borderColor: 'white',
                  },
                },
                "& .MuiInputLabel-root": {
                  color: 'white',
                  "&.Mui-focused": {
                    color: 'white',
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: 'white',
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: 'white',
                },
              }}
              inputProps={{
                style: {
                  color: 'white',
                },
              }}
            />
            <TextField
              fullWidth
              label="Name"
              name="name"
              margin="normal"
              variant="outlined"
              value={user.name}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: 'white',
                  "&.Mui-focused": {
                    borderColor: 'white',
                  },
                },
                "& .MuiInputLabel-root": {
                  color: 'white',
                  "&.Mui-focused": {
                    color: 'white',
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: 'white',
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: 'white',
                },
              }}
              inputProps={{
                style: {
                  color: 'white',
                },
              }}
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
              error={!!passwordError}
              helperText={passwordError}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: 'white',
                  "&.Mui-focused": {
                    borderColor: 'white',
                  },
                },
                "& .MuiInputLabel-root": {
                  color: 'white',
                  "&.Mui-focused": {
                    color: 'white',
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: 'white',
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: 'white',
                },
              }}
              inputProps={{
                style: {
                  color: 'white',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!!passwordError}
              sx={{
                mt: 2,
                backgroundColor: light[200],
                color: teal[700],
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: light[100],
                  color: teal[500],
                },
              }}
            >
              Register
            </Button>
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 1, cursor: "pointer", color: light[100] }}
              onClick={() => navigate("/")}
            >
              Already have an account?{" "}
              <Typography component="span" color="primary" sx={{ cursor: "pointer", color: light[100] }}>
                Sign In
              </Typography>
            </Typography>
          </Box>
        </Grid>

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
      </Grid>
    </>
  );
}
