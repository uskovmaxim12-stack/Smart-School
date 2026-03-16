import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { mockApi } from '../services/mockApi';
import Card from '../components/ui/Card/Card';
import Button from '../components/ui/Button/Button';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [grades, setGrades] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user.role === 'student') {
      setGrades(mockApi.getGrades(user.id));
      setSchedule(mockApi.getSchedule(user.classId || 1));
      setHomeworks(mockApi.getHomeworks(user.classId || 1));
    } else if (user.role === 'teacher') {
      // Заглушка
    }
    setLoading(false);
  }, [user]);

  const renderStudentDashboard = () => (
    <div className={styles.dashboard}>
      <div className={styles.main}>
        <h2 className={styles.sectionTitle}>📋 Лента событий</h2>
        <div className={styles.feed}>
          {grades.map(grade => (
            <Card key={grade.id} className={styles.feedItem}>
              <span className={styles.subject}>{grade.subject}</span>
              <span className={styles.grade}>Оценка: {grade.value}</span>
              <span className={styles.date}>{grade.date}</span>
            </Card>
          ))}
          {homeworks.map(hw => (
            <Card key={hw.id} className={styles.feedItem}>
              <span className={styles.subject}>{hw.subject}</span>
              <span className={styles.homeworkTitle}>{hw.title}</span>
              <span className={styles.date}>до {hw.dueDate}</span>
            </Card>
          ))}
        </div>
      </div>
      <div className={styles.sidebar}>
        <Card className={styles.widget}>
          <h3>Расписание на сегодня</h3>
          {schedule.filter(s => s.dayOfWeek === new Date().getDay()).map(lesson => (
            <div key={lesson.id} className={styles.lesson}>
              <span className={styles.time}>{lesson.lessonNumber} урок</span>
              <span className={styles.subject}>{lesson.subject}</span>
              <span className={styles.room}>{lesson.room}</span>
            </div>
          ))}
        </Card>
        <Card className={styles.widget}>
          <h3>Средний балл</h3>
          <div className={styles.average}>
            {grades.length > 0 
              ? (grades.reduce((acc, g) => acc + g.value, 0) / grades.length).toFixed(2)
              : '—'
            }
          </div>
        </Card>
      </div>
    </div>
  );

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.welcome}>С возвращением, {user.firstName}!</h1>
      {user.role === 'student' && renderStudentDashboard()}
      {user.role === 'teacher' && <div>Панель учителя</div>}
      {user.role === 'admin' && (
        <div className={styles.adminPanel}>
          <h2>Панель администратора</h2>
          <div className={styles.stats}>
            <Card>Всего пользователей: {mockApi.getUsers().length}</Card>
            <Card>Учеников: {mockApi.getUsers().filter(u => u.role === 'student').length}</Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
