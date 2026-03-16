import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Home, Users, BookOpen, Calendar, MessageSquare, Award, Settings, LogOut, Menu } from 'react-feather';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();

  const menuItems = {
    student: [
      { path: '/', icon: Home, label: 'Главная' },
      { path: '/schedule', icon: Calendar, label: 'Расписание' },
      { path: '/grades', icon: Award, label: 'Оценки' },
      { path: '/homeworks', icon: BookOpen, label: 'ДЗ' },
      { path: '/chats', icon: MessageSquare, label: 'Чаты' },
      { path: '/ai', icon: MessageSquare, label: 'ИИ-помощник' },
    ],
    teacher: [
      { path: '/', icon: Home, label: 'Главная' },
      { path: '/schedule', icon: Calendar, label: 'Расписание' },
      { path: '/gradebook', icon: Award, label: 'Журнал' },
      { path: '/homeworks', icon: BookOpen, label: 'ДЗ' },
      { path: '/chats', icon: MessageSquare, label: 'Чаты' },
      { path: '/ai', icon: MessageSquare, label: 'ИИ-помощник' },
    ],
    parent: [
      { path: '/', icon: Home, label: 'Главная' },
      { path: '/schedule', icon: Calendar, label: 'Расписание' },
      { path: '/grades', icon: Award, label: 'Оценки' },
      { path: '/homeworks', icon: BookOpen, label: 'ДЗ' },
      { path: '/chats', icon: MessageSquare, label: 'Чаты' },
    ],
    head_teacher: [
      { path: '/', icon: Home, label: 'Главная' },
      { path: '/classes', icon: Users, label: 'Классы' },
      { path: '/schedule', icon: Calendar, label: 'Расписание' },
      { path: '/reports', icon: Award, label: 'Отчёты' },
      { path: '/chats', icon: MessageSquare, label: 'Чаты' },
    ],
    director: [
      { path: '/', icon: Home, label: 'Главная' },
      { path: '/reports', icon: Award, label: 'Отчёты' },
      { path: '/announcements', icon: MessageSquare, label: 'Объявления' },
      { path: '/chats', icon: MessageSquare, label: 'Чаты' },
    ],
    admin: [
      { path: '/', icon: Home, label: 'Главная' },
      { path: '/users', icon: Users, label: 'Пользователи' },
      { path: '/admin/logs', icon: BookOpen, label: 'Логи' },
      { path: '/admin/settings', icon: Settings, label: 'Настройки' },
    ],
  };

  const items = menuItems[user?.role] || [];

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <button className={styles.toggle} onClick={() => setCollapsed(!collapsed)}>
        <Menu size={20} />
      </button>
      <div className={styles.logo}>
        {!collapsed && <span>Smart School</span>}
      </div>
      <nav className={styles.nav}>
        {items.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className={styles.footer}>
        <button className={styles.logout} onClick={logout}>
          <LogOut size={20} />
          {!collapsed && <span>Выход</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
