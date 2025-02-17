import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  MenuItem,
  Avatar,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Home as HomeIcon,
  List as TaskIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { dark, light, teal } from "../../theme/color";
import { logout } from "../../Store/endpoint/authEnd";


const sidebarWidth = 200;

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: sidebarWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  height: "calc(100vh - 64px)",
  position: "fixed",
  top: "64px",
  left: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  color: "white",
  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  backgroundColor: dark[900],
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  marginLeft: `${sidebarWidth}px`,
  padding: theme.spacing(3),
}));

const menuItems = [
  { text: "Home", path: "/dashboard", icon: <HomeIcon /> },
  { text: "Tasks", path: "/tasks", icon: <TaskIcon /> },
];

export default function SidebarPage() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleCancelLogout = () => {
    setOpenDialog(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setOpenDialog(false);
      setOpenSuccessDialog(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleSuccessOk = () => {
    setOpenSuccessDialog(false);
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: teal[500], zIndex: 1201 }}>
        <Toolbar>
          <MenuIcon sx={{ marginRight: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            MyToDoList
          </Typography>
        </Toolbar>
      </AppBar>

      <SidebarContainer>
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <NavLink
                to={item.path}
                style={{ textDecoration: "none", color: "inherit", width: "100%" }}
                onClick={() => setActiveIndex(index)}
              >
                <ListItemButton
                  sx={{
                    backgroundColor: activeIndex === index ? teal[500] : "transparent",
                    "&:hover": { backgroundColor: dark[100] },
                  }}
                >
                  <ListItemIcon sx={{ color: activeIndex === index ? light[100] : teal[500] }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText sx={{ color: activeIndex === index ? light[100] : teal[500] }} primary={item.text} />
                </ListItemButton>
              </NavLink>
            </ListItem>
          ))}
        </List>

        <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0", textAlign: "center" }}>
          <Avatar
            sx={{ bgcolor: teal[500], cursor: "pointer", mx: "auto" }}
            onClick={handleMenuOpen}
          >
            A
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            transformOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          </Menu>
        </Box>
      </SidebarContainer>

      <ContentContainer>
        <Toolbar />
        <Outlet />
      </ContentContainer>

      {/* Konfirmasi Logout */}
      <Dialog open={openDialog} onClose={handleCancelLogout}>
        <DialogTitle>{"Are you sure you want to logout?"}</DialogTitle>
        <DialogContent>
          <Typography>Once logged out, you will be redirected to the login page.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleCancelLogout} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Logout */}
      <Dialog open={openSuccessDialog} onClose={handleSuccessOk}>
        <DialogTitle>{"Logout Successful"}</DialogTitle>
        <DialogContent>
          <Typography>You have successfully logged out. Redirecting to login page...</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleSuccessOk} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}