import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const Homeworks = () => {
  const { user } = useAuthStore();
  const [homeworks, setHomeworks] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const fetchHomeworks = async () => {
    // Need to get student's class
    const studentRes = await api.get(`/users/me`); // includes class_id from earlier
    const classId = studentRes.data.class_id;
    const response = await api.get(`/homeworks?class_id=${classId}`);
    setHomeworks(response.data);
  };

  const handleSubmit = async (homeworkId) => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    await api.post(`/homeworks/${homeworkId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    alert('Работа сдана');
  };

  return (
    <div>
      <h1>Домашние задания</h1>
      <ul>
        {homeworks.map(hw => (
          <li key={hw.id}>
            <h3>{hw.title}</h3>
            <p>{hw.description}</p>
            <p>Срок: {new Date(hw.due_date).toLocaleDateString()}</p>
            <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
            <button onClick={() => handleSubmit(hw.id)}>Сдать</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Homeworks;
