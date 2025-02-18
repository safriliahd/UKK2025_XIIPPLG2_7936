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
import { teal } from "../../../theme/color";
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



  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const handleDateFilter = (date) => {
    setSelectedDate(date); 
  };

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
        </Box>

        <AddTaskUI />
      </Box>



      <Box p={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellStyle}>ID</TableCell>
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
                filteredTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task) => (
                  <TableRow key={task.id}>
                    <TableCell sx={{ textAlign: 'center' }}>{task.id}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{new Date(task.date).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{task.task}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{categories[task.categoryId] || "Unknown"}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{task.status === "COMPLETE" ? "Completed" : "Pending"}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {task.status === "COMPLETE" ? (
                        <IconButton color="warning">
                          <Undo />
                        </IconButton>
                      ) : (
                        <IconButton sx={{ color: teal[500] }}>
                          <CheckCircle />
                        </IconButton>
                      )}
                      <IconButton sx={{ color: teal[800] }}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error">
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
      </Box>
    </>
  );
}
