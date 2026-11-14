import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import GuestRoute from "./components/auth/GuestRoute";

import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Signup from "./pages/public/Signup";
import Courses from "./pages/public/Courses";
import CourseDetails from "./pages/public/CourseDetails";

import Purchases from "./pages/user/Purchases";
import MyCourse from "./pages/user/MyCourse";
import Profile from "./pages/user/Profile";

import AdminLayout from "./components/admin/AdminLayout";
// import AdminDashboard from "./pages/admin/Dashboard";
import ManageCourses from "./pages/admin/ManageCourses";
import EditCourse from "./pages/admin/EditCourse";
import AddCourse from "./pages/admin/CreateCourse";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetails />} />

        {/* Guest Only Routes */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/my-courses" element={<Purchases />} />
          <Route path="/my-courses/:id" element={<MyCourse />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="courses" replace />}  />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="courses/new" element={<AddCourse />} />
            <Route path="courses/:id/edit" element={<EditCourse />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
