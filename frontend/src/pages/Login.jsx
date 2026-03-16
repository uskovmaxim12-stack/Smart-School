import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Card from '../components/ui/Card/Card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/Input/Input';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password, role);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <h1 className={styles.title}>Smart School</h1>
        <p className={styles.subtitle}>Вход в систему</p>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className={styles.roleSelector}>
            <label>Роль:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className={styles.select}>
              <option value="student">Ученик</option>
              <option value="teacher">Учитель</option>
              <option value="parent">Родитель</option>
              <option value="head_teacher">Завуч</option>
              <option value="director">Директор</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
          <Button type="submit" variant="primary" className={styles.button}>Войти</Button>
        </form>
        <div className={styles.links}>
          <Link to="/register" className={styles.link}>Регистрация для учеников</Link>
          <Link to="/forgot-password" className={styles.link}>Забыли пароль?</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
