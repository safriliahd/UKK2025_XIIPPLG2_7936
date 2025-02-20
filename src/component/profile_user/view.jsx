import { useEffect, useState } from "react"
import { getUserById } from "../../Store/endpoint/authEnd";
import { Avatar, Container, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { teal } from "../../theme/color";

export default function ProfileUser() {
    const [user, setUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const response = await getUserById(userId);
                    setUser(response.user);
                } catch (error) {
                    console.error('Failed to fetch user:', error.message);
                }
            }
        };
        fetchUser();
    }, []);

    const togglePasswordVisiblity = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <>
            <Container maxWidth='sm' >
                <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', marginTop: 5 }}>
                    <Typography variant="h4" fontWeight='bold' color={teal[700]}>Your Profile</Typography>
                    <Avatar
                        sx={{ bgcolor: teal[500], width: 80, height: 80, fontSize: 36, mx: "auto", mt: 3 }}
                    >
                        {user?.name ? user.name[0] : 'U'}
                    </Avatar>
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Name'
                                value={user?.name || 'Not available'}
                                inputProps={{ readOnly: true }}
                                fullWidth
                            />
                            <TextField
                                label='Username'
                                value={`@${user?.username || 'Not available'}`}
                                inputProps={{ readOnly: true }}
                                fullWidth
                                sx={{ mt: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Email'
                                value={user?.email || 'Not available'}
                                inputProps={{ readOnly: true }}
                                fullWidth
                            />
                            <TextField
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={user?.password || "********"}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={togglePasswordVisiblity} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                fullWidth
                                sx={{ mt: 2 }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </>
    )
}