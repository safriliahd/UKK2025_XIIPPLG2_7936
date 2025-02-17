import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./component/auth/login" ;
import RegisterPage from "./component/auth/register";
import TasksPage from "./component/tasks/view";
import SidebarPage from "./component/sidebar/view";
import DashboardPage from "./component/dashboard/view";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage /> } />
        <Route path="/signUp" element={<RegisterPage />} />
        
        <Route path="/" element={<SidebarPage />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tasks" element={<TasksPage />} />
        </Route>
      </Routes>
    </Router>
  );
}