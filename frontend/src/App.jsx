// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentCalendarPage from './pages/StudentCalendarPage';
import TeacherCalendarPage from './pages/TeacherCalendarPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/aluno/calendario" element={<StudentCalendarPage />} />
        <Route path="/professor/calendario" element={<TeacherCalendarPage />} />
      </Routes>
    </Router>
  );
}

export default App;
