import { useState, useEffect } from "react";
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
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    CircularProgress,
    Typography
} from "@mui/material";
import { light, teal } from "../../../theme/color";
import { addTask } from "../../../Store/endpoint/tasksEnd";
import { getCategories } from "../../../Store/endpoint/categoryEnd";

export default function AddTaskUI() {
    const [open, setOpen] = useState(false);
    const [task, setTask] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [userId, setUserId] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) setUserId(Number(storedUserId));
    
        const fetchCategories = async () => {
            try {
                if (!storedUserId) {
                    throw new Error("User ID not found. Please log in again.");
                }
    
                const data = await getCategories(); 
    
                const filteredCategories = data.filter(category => category.userId === Number(storedUserId));
                
                setCategories(filteredCategories);
                setLoading(false);
            } catch (err) {
                setError(err.message || "Failed to fetch categories");
                setLoading(false);
            }
        };
    
        fetchCategories();
    }, []);
    

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setTask("");
        setSelectedCategory("");
    };

    const handleSubmit = async () => {
        try {
            if (!userId) {
                throw new Error("User ID not found. Please log in again.");
            }
            if (!selectedCategory) {
                throw new Error("Please select a category.");
            }
            if (!task.trim()) {
                throw new Error("Task name cannot be empty.");
            }
    
            await addTask({ task, categoryId: selectedCategory, userId });
            setSnackbar({ open: true, message: "Task added successfully!", severity: "success" });
    
            setTimeout(() => {
                window.location.reload(); 
            }, 1000); 
    
            handleClose();
        } catch (error) {
            setSnackbar({ open: true, message: error.message, severity: "error" });
        }
    };
    

    return (
        <Box>
            <Grid container spacing={2} justifyContent="flex-end">
                <Grid item xs={12} sm="auto">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpen}
                        sx={{
                            p: 2,
                            width: { xs: "100%", sm: "auto" },
                            backgroundColor: teal[500],
                            color: light[200],
                            '&:hover': {
                                backgroundColor: teal[300],
                                color: light[100],
                            }
                        }}
                    >
                        Add Task
                    </Button>
                </Grid>
            </Grid>

            {/* Dialog Add Task */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle fontWeight='bold'>Add New Task</DialogTitle>
                <DialogContent sx={{width: '500px'}}>
                    {error && <Typography color="error">{error}</Typography>}
                    <FormControl fullWidth margin="dense" disabled={loading || !!error}>
                        <InputLabel>Select Category</InputLabel>
                        <Select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {loading ? (
                                <MenuItem disabled>
                                    <CircularProgress size={24} />
                                </MenuItem>
                            ) : (
                                categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.category}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Task Name"
                        fullWidth
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Add</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar notif */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
