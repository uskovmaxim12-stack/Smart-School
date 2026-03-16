import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const Schedule = () => {
  const { user } = useAuthStore();
  const [schedule, setSchedule] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchSchedule();
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    const response = await api.get('/classes');
    setClasses(response.data);
  };

  const fetchSchedule = async () => {
    const response = await api.get(`/schedule?class_id=${selectedClass}`);
    setSchedule(response.data);
  };

  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  return (
    <div>
      <h1>Расписание</h1>
      {user.role === 'head_teacher' && (
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">Выберите класс</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      )}
      {selectedClass && (
        <table>
          <thead>
            <tr>
              <th>Урок</th>
              {days.map(d => <th key={d}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {[1,2,3,4,5,6,7].map(lessonNum => (
              <tr key={lessonNum}>
                <td>{lessonNum}</td>
                {days.map((_, dayIndex) => {
                  const lesson = schedule.find(l => l.day_of_week === dayIndex && l.lesson_number === lessonNum);
                  return (
                    <td key={dayIndex}>
                      {lesson ? `${lesson.subject_name} (${lesson.room})` : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Schedule;
