import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./component/auth/login";
import RegisterPage from "./component/auth/register";
import TasksPage from "./component/tasks/view";
import SidebarPage from "./component/sidebar/view";
import DashboardPage from "./component/dashboard/view";
import ProfileUser from "./component/profile_user/view";
import ProtectedRoute from "./Store/ProtectedRoute";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signUp" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<SidebarPage />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="profile" element={<ProfileUser />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}