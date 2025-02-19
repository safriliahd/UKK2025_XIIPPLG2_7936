import { Box, CircularProgress, Container, Typography } from "@mui/material";
import ImageTeal from "../../../public/Checklist-pana.svg"
import { useEffect, useState } from "react";
import { getUserById } from "../../Store/endpoint/authEnd";
import { teal } from "../../theme/color";

export default function DashboardPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            getUserById(userId)
                .then(data => setUser(data))
                .catch(error => console.error("Error fetching user:", error));
        }
    }, [])

    return (
        <>
            <Container maxWidth="sm">
                <Box textAlign="center" mt={5} p={3} sx={{ margin: 'auto' }}>
                    {/* <Typography variant="h4" sx={{ textAlign: 'center' }}>UKK2025_XIIPPLG2_7936</Typography> */}
                    <Typography variant="h4" fontWeight='bold' color={teal[700]}>Home Page</Typography>
                    {user ? (
                        <>
                        <Typography variant="h5" color={teal[500]} mt={2} fontWeight='bold'>
                            Welcome, {user?.user.name}!
                        </Typography>
                        <Box mt={3}>
                            <img src={ImageTeal} alt="Dashboard Ilustration" width="100%" style={{ maxWidth: '500px'}} />
                        </Box>
                        </>
                    ) : (
                        <Box display='flex' justifyContent='center' mt={2}>
                            <CircularProgress />
                        </Box>
                    )}
                </Box>
            </Container>
        </>
    )
}