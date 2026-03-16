import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'student',
    class_id: '',
    children_ids: [],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await api.get('/users');
    setUsers(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/users', formData);
    setShowForm(false);
    fetchUsers();
  };

  return (
    <div>
      <h1>Управление пользователями</h1>
      <button onClick={() => setShowForm(true)}>Добавить пользователя</button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="text" placeholder="Имя" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} required />
          <input type="text" placeholder="Фамилия" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} required />
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="student">Ученик</option>
            <option value="teacher">Учитель</option>
            <option value="parent">Родитель</option>
            <option value="head_teacher">Завуч</option>
            <option value="director">Директор</option>
            <option value="admin">Администратор</option>
          </select>
          {formData.role === 'student' && (
            <input type="text" placeholder="ID класса" value={formData.class_id} onChange={(e) => setFormData({...formData, class_id: e.target.value})} />
          )}
          {formData.role === 'parent' && (
            <input type="text" placeholder="ID детей (через запятую)" onChange={(e) => setFormData({...formData, children_ids: e.target.value.split(',').map(Number)})} />
          )}
          <button type="submit">Создать</button>
          <button type="button" onClick={() => setShowForm(false)}>Отмена</button>
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.role}</td>
              <td>
                <button>Блокировать</button>
                <button>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
