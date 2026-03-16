import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Users from './pages/admin/Users';
import Classes from './pages/head/Classes';
import Schedule from './pages/Schedule';
import Gradebook from './pages/teacher/Gradebook';
import Homeworks from './pages/student/Homeworks';
import Chat from './pages/Chat';
import AIAssistant from './pages/AIAssistant';
import AdminSettings from './pages/admin/Settings';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute roles={['admin']}><Users /></PrivateRoute>} />
        <Route path="/classes" element={<PrivateRoute roles={['head_teacher', 'director']}><Classes /></PrivateRoute>} />
        <Route path="/schedule" element={<PrivateRoute><Schedule /></PrivateRoute>} />
        <Route path="/gradebook" element={<PrivateRoute roles={['teacher']}><Gradebook /></PrivateRoute>} />
        <Route path="/homeworks" element={<PrivateRoute roles={['student', 'parent']}><Homeworks /></PrivateRoute>} />
        <Route path="/chats" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/ai" element={<PrivateRoute><AIAssistant /></PrivateRoute>} />
        <Route path="/admin/settings" element={<PrivateRoute roles={['admin']}><AdminSettings /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
