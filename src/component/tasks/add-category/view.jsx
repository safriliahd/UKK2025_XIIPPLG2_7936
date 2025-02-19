import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Snackbar,
    Alert,
    Grid,
    Paper,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress
} from "@mui/material";
import { addCategory, deleteCategory, editCategory, getCategories } from "../../../Store/endpoint/categoryEnd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { light, teal } from "../../../theme/color";

export default function CategoryUI() {
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuCategory, setMenuCategory] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        console.log("Stored User ID:", storedUserId);

        if (storedUserId) {
            setUserId(parseInt(storedUserId));
            fetchCategories(parseInt(storedUserId));
        } else {
            console.error("User ID not found in localStorage");
        }
    }, [])


    const fetchCategories = async (userId) => {
        try {
            setLoading(true);
            const data = await getCategories();
            const userCategories = data.filter(cat => cat.userId === userId);
            setCategories(userCategories);
        } catch (err) {
            setSnackbar({ open: true, message: err.message || "Failed to fetch categories", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        setCategory('');
        setEditMode(false);
        setSelectedCategory(null);
        setOpen(true);
    }

    const handleEditOpen = (cat) => {
        setCategory(cat.category);
        setSelectedCategory(cat);
        setEditMode(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCategory("");
        setSelectedCategory(null);
    };

    const handleSubmit = async () => {
        try {
            console.log("Submitting Category:", category, "User ID:", userId);
            if (!category.trim()) {
                setSnackbar({ open: true, message: "Category name cannot be empty!", severity: "error" });
                return;
            }

            if (!userId) {
                throw new Error("User ID not found. Please log in again.");
            }

            if (editMode && selectedCategory) {
                await editCategory(selectedCategory.id, { category, userId });
                setSnackbar({ open: true, message: "Category updated successfully!", severity: "success" });
            } else {
                await addCategory({ category, userId });
                setSnackbar({ open: true, message: "Category added successfully!", severity: "success" });
            }

            setTimeout(() => {
                window.location.reload();
            }, 1000);

            fetchCategories(userId);
            handleClose();
        } catch (error) {
            setSnackbar({ open: true, message: error.message, severity: "error" });
        }
    };

    const handleDeleteConfirmOpen = () => {
        setConfirmDeleteOpen(true);
        setMenuAnchor(null);
    };

    const handleDeleteConfirmClose = () => {
        setConfirmDeleteOpen(false);
    };

    const handleDelete = async () => {
        try {
            if (menuCategory) {
                await deleteCategory(menuCategory.id);
                setSnackbar({ open: true, message: "Category deleted successfully!", severity: "success" });
                fetchCategories(userId);
            }
        } catch (error) {
            setSnackbar({ open: true, message: error.message, severity: "error" });
        }
        setConfirmDeleteOpen(false);
    };


    return (
        <>
            <Box px={2} pb={2} mb={3} mt={3} component={Paper}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpen}
                            fullWidth
                            sx={{ py: 2, backgroundColor: teal[500], color: light[200], '&:hover': { backgroundColor: teal[300] } }}
                        >
                            Add Category
                        </Button>
                    </Grid>

                    <Grid item xs={12} sm={10}>
                        <Box sx={{ overflowX: "auto", whiteSpace: "nowrap", display: "flex", flexWrap: "nowrap", gap: 2, p: 1, minHeight: 60 }}>
                            {loading ? (
                                <CircularProgress />
                            ) : categories.length > 0 ? (
                                categories.map((cat) => (
                                    <Paper key={cat.id} elevation={3} sx={{ py: 1, px: 2, textAlign: "center", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Typography variant="body1">{cat.category}</Typography>
                                        {cat.userId === userId && (
                                            <IconButton onClick={(event) => { setMenuAnchor(event.currentTarget); setMenuCategory(cat); }}>
                                                <MoreVertIcon sx={{ color: teal[700] }} />
                                            </IconButton>
                                        )}
                                    </Paper>
                                ))
                            ) : (
                                <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>No categories available</Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                    <MenuItem onClick={() => { handleEditOpen(menuCategory); setMenuAnchor(null); }}>Edit</MenuItem>
                    <MenuItem onClick={handleDeleteConfirmOpen}>Delete</MenuItem>
                </Menu>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle fontWeight='bold'>{editMode ? "Edit Category" : "Add Category"}</DialogTitle>
                    <DialogContent sx={{width: '500px'}}>
                        <TextField
                            label="Category Name"
                            fullWidth
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">Cancel</Button>
                        <Button onClick={handleSubmit} color="primary">{editMode ? "Update" : "Add"}</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={confirmDeleteOpen} onClose={handleDeleteConfirmClose}>
                    <DialogTitle fontWeight='bold'>Confirm Deletion</DialogTitle>
                    <DialogContent sx={{width: '500px'}}>Are you sure you want to delete this category?</DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteConfirmClose} color="secondary">Cancel</Button>
                        <Button onClick={handleDelete} color="error">Delete</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
                </Snackbar>
            </Box>
        </>
    )
}