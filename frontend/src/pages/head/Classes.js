import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [form, setForm] = useState({ name: '', grade: '', academic_year: '', homeroom_teacher_id: '' });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const response = await api.get('/classes');
    setClasses(response.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/classes', form);
    fetchClasses();
    setForm({ name: '', grade: '', academic_year: '', homeroom_teacher_id: '' });
  };

  const viewClass = async (id) => {
    const response = await api.get(`/classes/${id}`);
    setSelectedClass(response.data);
  };

  return (
    <div>
      <h1>Классы</h1>
      <div>
        <h2>Создать класс</h2>
        <form onSubmit={handleCreate}>
          <input placeholder="Название (например 5А)" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
          <input placeholder="Цифра класса (5)" value={form.grade} onChange={(e) => setForm({...form, grade: e.target.value})} required />
          <input placeholder="Учебный год (2024-2025)" value={form.academic_year} onChange={(e) => setForm({...form, academic_year: e.target.value})} required />
          <input placeholder="ID классного руководителя" value={form.homeroom_teacher_id} onChange={(e) => setForm({...form, homeroom_teacher_id: e.target.value})} />
          <button type="submit">Создать</button>
        </form>
      </div>
      <ul>
        {classes.map(cls => (
          <li key={cls.id} onClick={() => viewClass(cls.id)}>
            {cls.name} ({cls.academic_year})
          </li>
        ))}
      </ul>
      {selectedClass && (
        <div>
          <h2>Класс {selectedClass.name}</h2>
          <h3>Ученики</h3>
          <ul>
            {selectedClass.students?.map(s => <li key={s.id}>{s.first_name} {s.last_name}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Classes;
