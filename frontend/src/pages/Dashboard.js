import React from 'react';
import { useAuthStore } from '../store/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  const renderDashboard = () => {
    switch (user.role) {
      case 'student':
        return <StudentDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'parent':
        return <ParentDashboard />;
      case 'head_teacher':
        return <HeadTeacherDashboard />;
      case 'director':
        return <DirectorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div>
      <h1>Добро пожаловать, {user.first_name}!</h1>
      {renderDashboard()}
    </div>
  );
};

const StudentDashboard = () => {
  // Fetch recent grades, homework, etc.
  return (
    <div>
      <h2>Лента событий</h2>
      {/* Widgets */}
    </div>
  );
};

const TeacherDashboard = () => {
  return (
    <div>
      <h2>Мои уроки сегодня</h2>
      {/* List */}
    </div>
  );
};

const ParentDashboard = () => {
  return (
    <div>
      <h2>Успеваемость детей</h2>
      {/* Children list with stats */}
    </div>
  );
};

const HeadTeacherDashboard = () => {
  return <div>Панель завуча</div>;
};

const DirectorDashboard = () => {
  return <div>Панель директора</div>;
};

const AdminDashboard = () => {
  return <div>Панель администратора</div>;
};

export default Dashboard;
