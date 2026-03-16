import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card/Card';
import styles from './StudentDashboard.module.css';
import api from '../../services/api';
import { Calendar, Award, BookOpen, Bell } from 'react-feather';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [feed, setFeed] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [averageGrades, setAverageGrades] = useState([]);

  useEffect(() => {
    fetchFeed();
    fetchTodaySchedule();
    fetchDeadlines();
    fetchAverageGrades();
  }, []);

  const fetchFeed = async () => {
    const res = await api.get('/feed'); // предположим, такой эндпоинт есть
    setFeed(res.data);
  };

  const fetchTodaySchedule = async () => {
    const res = await api.get('/schedule/today');
    setSchedule(res.data);
  };

  const fetchDeadlines = async () => {
    const res = await api.get('/homeworks/deadlines');
    setDeadlines(res.data);
  };

  const fetchAverageGrades = async () => {
    const res = await api.get('/grades/average');
    setAverageGrades(res.data);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.feed}>
        <h2>Лента событий</h2>
        {feed.map(item => (
          <Card key={item.id} className={styles.feedItem}>
            <div className={styles.feedIcon}>
              {item.type === 'grade' && <Award color="var(--accent)" />}
              {item.type === 'homework' && <BookOpen color="var(--accent)" />}
              {item.type === 'announcement' && <Bell color="var(--accent)" />}
            </div>
            <div className={styles.feedContent}>
              <p>{item.content}</p>
              <span className={styles.feedDate}>{new Date(item.createdAt).toLocaleString()}</span>
            </div>
          </Card>
        ))}
      </div>
      
      <div className={styles.widgets}>
        <Card className={styles.widget}>
          <h3>Расписание на сегодня</h3>
          {schedule.map(lesson => (
            <div key={lesson.id} className={styles.lesson}>
              <span className={styles.time}>{lesson.time}</span>
              <span className={styles.subject}>{lesson.subject}</span>
              <span className={styles.room}>{lesson.room}</span>
            </div>
          ))}
          <Link to="/schedule" className={styles.moreLink}>Подробнее</Link>
        </Card>

        <Card className={styles.widget}>
          <h3>Ближайшие дедлайны</h3>
          {deadlines.map(hw => (
            <div key={hw.id} className={styles.deadline}>
              <span className={styles.deadlineSubject}>{hw.subject}</span>
              <span className={styles.deadlineDate}>{new Date(hw.dueDate).toLocaleDateString()}</span>
            </div>
          ))}
        </Card>

        <Card className={styles.widget}>
          <h3>Средний балл</h3>
          {averageGrades.map(g => (
            <div key={g.subject} className={styles.gradeItem}>
              <span>{g.subject}</span>
              <span className={styles.gradeValue}>{g.average}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
