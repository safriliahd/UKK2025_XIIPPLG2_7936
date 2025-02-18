import { Typography } from "@mui/material";
import CategoryUI from "./add-category/view";
import AddTaskUI from "./add-tasks/view";
import AllTasksUI from "./all-tasks/view";

export default function TasksPage() {
    return (
        <>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', px: 2 }}>My Tasks</Typography>
            {/* <CategoryUI />
            <AddTaskUI /> */}
            <AllTasksUI />
        </>
    )
}