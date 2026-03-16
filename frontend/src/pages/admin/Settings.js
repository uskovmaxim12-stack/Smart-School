import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [schoolName, setSchoolName] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const response = await api.get('/admin/settings');
    setSettings(response.data);
    setSchoolName(response.data.school_name || '');
  };

  const handleSave = async () => {
    await api.put('/admin/settings', { key: 'school_name', value: schoolName });
    alert('Сохранено');
  };

  return (
    <div>
      <h1>Настройки системы</h1>
      <div>
        <label>Название школы:</label>
        <input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
      </div>
      <button onClick={handleSave}>Сохранить</button>
    </div>
  );
};

export default AdminSettings;
