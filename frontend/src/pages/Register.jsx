import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Card from '../components/ui/Card/Card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/Input/Input';
import styles from './Login.module.css'; // переиспользуем стили

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    const result = await register({ firstName, lastName, email, password, role: 'student' });
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <h1 className={styles.title}>Регистрация ученика</h1>
        {success ? (
          <div className={styles.success}>
            Регистрация успешна! Через 3 секунды вы будете перенаправлены на страницу входа.
          </div>
        ) : (
          <>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <Input
                label="Имя"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Фамилия"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
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
              <Input
                label="Подтвердите пароль"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" className={styles.button}>
                Зарегистрироваться
              </Button>
            </form>
            <div className={styles.links}>
              <Link to="/login" className={styles.link}>Уже есть аккаунт? Войти</Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Register;
