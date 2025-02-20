import { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, CheckCircle, Undo } from "@mui/icons-material";
import { getTasks, deleteTask, completeTask, undoTask, editTask } from "../../../Store/endpoint/tasksEnd";
import { getCategories } from "../../../Store/endpoint/categoryEnd";
import { light, teal } from "../../../theme/color";
import CategoryUI from "../add-category/view";
import AddTaskUI from "../add-tasks/view";

export default function AllTasksUI() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, taskId: null });
  const [editDialog, setEditDialog] = useState({ open: false, task: null });

  const userId = Number(localStorage.getItem("userId"));


  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksData = await getTasks();
        const categoriesData = await getCategories();

        const userTasks = tasksData.filter(task => task.userId === userId)

        const userCategories = categoriesData.filter(category => category.userId === userId);

        const categoriesMap = userCategories.reduce((acc, category) => {
          acc[category.id] = category.category;
          return acc;
        }, {});

        setTasks(userTasks);
        setCategories(categoriesMap);
      } catch (error) {
        setSnackbar({ open: true, message: error.message, severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);


  const handleComplete = async (taskId) => {
    try {
      await completeTask(taskId);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? { ...t, status: "COMPLETE" } : t))
      );
      setSnackbar({ open: true, message: "Task completed", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    }
  };

  const handleUndo = async (taskId) => {
    try {
      await undoTask(taskId);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? { ...t, status: "PENDING" } : t))
      );
      setSnackbar({ open: true, message: "Task marked as pending", severity: "info" });
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    }
  };

  const handleOpenDeleteDialog = (taskId) => {
    setDeleteDialog({ open: true, taskId });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, taskId: null });
  };

  const handleDelete = async () => {
    try {
      await deleteTask(deleteDialog.taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== deleteDialog.taskId));
      setSnackbar({ open: true, message: "Task deleted successfully", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleOpenEditDialog = (task) => {
    setEditDialog({ open: true, task });
  };

  const handleCloseEditDialog = () => {
    setEditDialog({ open: false, task: null });
  };

  const handleEdit = async () => {
    try {
      await editTask(editDialog.task.id, { task: editDialog.task.task });
      setTasks((prevTasks) => prevTasks.map((t) => (t.id === editDialog.task.id ? editDialog.task : t)));
      setSnackbar({ open: true, message: "Task updated successfully", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    } finally {
      handleCloseEditDialog();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.date).toISOString().split("T")[0];
    return (
      (selectedCategory === "" || String(task.categoryId) === selectedCategory) &&
      (selectedStatus === "" || task.status === selectedStatus) &&
      (selectedDate === "" || taskDate === selectedDate)
    );
  });


  const headerCellStyle = {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '1.1rem',
  };
  return (
    <>
      <Box>
        <CategoryUI />
      </Box>

      <Box component={Paper}>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" gap={2}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Category</InputLabel>
              <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {Object.entries(categories).map(([id, name]) => (
                  <MenuItem key={id} value={id}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ width: 200 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="COMPLETE">Complete</MenuItem>
                <MenuItem value="NOT_COMPLETE">Pending</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ width: 200 }}>
              <TextField
                label="Filter by Date"
                type="date"
                value={selectedDate || ""}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            </FormControl>
            
            {(selectedCategory || selectedStatus || selectedDate) && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedStatus("");
                  setSelectedDate("");
                }}
                sx={{
                  borderColor: teal[500],
                  color: teal[500],
                  "&:hover": {
                    backgroundColor: light[200],
                    borderColor: teal[700],
                    color: teal[700],
                  },
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
          <AddTaskUI />
        </Box>

        <Box px={2}>
          <TableContainer component={Paper} sx={{ maxHeight: '45vh', overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellStyle}>No</TableCell>
                  <TableCell sx={headerCellStyle}>Date</TableCell>
                  <TableCell sx={headerCellStyle}>Task</TableCell>
                  <TableCell sx={headerCellStyle}>Category</TableCell>
                  <TableCell sx={headerCellStyle}>Status</TableCell>
                  <TableCell sx={headerCellStyle}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', fontStyle: 'italic', color: 'gray' }}>
                      There are no tasks
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task, index) => (
                    <TableRow key={task.id}>
                      <TableCell sx={{ textAlign: 'center' }}> {page * rowsPerPage + index + 1}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{new Date(task.date).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ textAlign: 'center', width: '350px' }}>{task.task}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{categories[task.categoryId] || "Unknown"}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{task.status === "COMPLETE" ? "Completed" : "Pending"}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {task.status === "COMPLETE" ? (
                          <IconButton onClick={() => handleUndo(task.id)} color="warning">
                            <Undo />
                          </IconButton>
                        ) : (
                          <IconButton onClick={() => handleComplete(task.id)} sx={{ color: teal[500] }}>
                            <CheckCircle />
                          </IconButton>
                        )}
                        <IconButton onClick={() => handleOpenEditDialog(task)} sx={{ color: teal[800] }}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDeleteDialog(task.id)} color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tasks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
          />

          <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
          </Snackbar>

          <Dialog open={deleteDialog.open} onClose={handleCloseDeleteDialog}>
            <DialogTitle fontWeight='bold'>Confirm Delete</DialogTitle>
            <DialogContent sx={{width: '500px'}}>
              <DialogContentText>Are you sure you want to delete this task?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog} color="secondary">Cancel</Button>
              <Button onClick={handleDelete} color="error" autoFocus>Delete</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={editDialog.open} onClose={handleCloseEditDialog}>
            <DialogTitle fontWeight='bold'>Edit Task</DialogTitle>
            <DialogContent sx={{width: '500px'}}>
              <TextField fullWidth label="Task"           variant="standard" value={editDialog.task?.task || ''} onChange={(e) => setEditDialog((prev) => ({ ...prev, task: { ...prev.task, task: e.target.value } }))} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog} color="secondary">Cancel</Button>
              <Button onClick={handleEdit} color="primary">Save</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
}
