import React, { useState } from "react";
import { TextField, Button, Container, Typography, Paper, Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Collapse, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../../Store/endpoint/authEnd";
import ImageTeal from "../../../public/imageTeal.jpg"
import { light, teal } from "../../theme/color";

export default function LoginPage() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(user);
      console.log("Login successful", response);

      localStorage.setItem("isAuthenticated", "true");
      setOpenSuccessDialog(true);

      // setError("");
    } catch (err) {
      setError( "Login failed");
    }
  };

  const handleSuccessDialogClose = () => {
    setOpenSuccessDialog(false);
    navigate("/dashboard");
  }

  return (
    <>
      <Grid container component="main" sx={{ height: '98vh',  backgroundColor: teal[500],}}>
        <Grid
          item
          xs={false} sm={8} md={8}
          sx={{
            backgroundImage: `url(${ImageTeal})`,
            backgroundRepeat: "no-repeat",
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
          <Typography variant="h4" align="center" gutterBottom sx={{color: light[100], fontWeight: 'bold'}}>
            Sign In
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Box component="form" onSubmit={handleSubmit}>
            <Collapse in={Boolean(error)}>
              <Alert severity="error" sx={{mb: 2}}>
                {error}
              </Alert>
            </Collapse>
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
              label="Password"
              name="password"
              type="password"
              margin="normal"
              variant="outlined"
              value={user.password}
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
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
              Login
            </Button>
          </Box>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, cursor: "pointer", color: light[100] }}
            onClick={() => navigate("/signUp")}
          >
            Don't have an account? <Typography component="span" sx={{ cursor: "pointer", color: light[100] }}>Sign Up</Typography>
          </Typography>

          <Dialog open={openSuccessDialog} onClose={handleSuccessDialogClose}>
            <DialogTitle fontWeight='bold'>Login Successful</DialogTitle>
            <DialogContent sx={{width: '500px'}}>
              <Typography>You have successfully logged in. The system will redirect you to the dashboard.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSuccessDialogClose} color="primary">OK</Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </>
  );
}
