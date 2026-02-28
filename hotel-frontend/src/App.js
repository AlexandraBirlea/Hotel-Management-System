import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import GuestLogin from "./components/GuestLogin";
import EmployeeLogin from "./components/EmployeeLogin";
import GuestDashboard from "./components/GuestDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import GuestRegister from "./components/GuestRegister";
import EmployeeRegister from "./components/EmployeeRegister";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";

import "./App.css";

export const API_BASE = "http://localhost:8080";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Login */}
        <Route path="/login/guest" element={<GuestLogin />} />
        <Route path="/login/employee" element={<EmployeeLogin />} />

        {/* Register */}
        <Route path="/register/guest" element={<GuestRegister />} />
        <Route path="/register/employee" element={<EmployeeRegister />} />

        {/* Dashboards */}
        <Route path="/guest" element={<GuestDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
