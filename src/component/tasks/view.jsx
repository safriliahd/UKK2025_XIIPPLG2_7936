import { Typography } from "@mui/material";
import AllTasksUI from "./all-tasks/view";
import { teal } from "../../theme/color";

export default function TasksPage() {
    return (
        <>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: teal[700] }}>My Tasks</Typography>
            <AllTasksUI />
        </>
    )
}