import React from 'react';
import { useAuthStore } from '../store/authStore';

const Profile = () => {
  const { user } = useAuthStore();
  return (
    <div>
      <h1>Профиль</h1>
      <p>Имя: {user.first_name} {user.last_name}</p>
      <p>Email: {user.email}</p>
      <p>Роль: {user.role}</p>
      {/* Форма смены пароля, загрузка аватара */}
    </div>
  );
};

export default Profile;
