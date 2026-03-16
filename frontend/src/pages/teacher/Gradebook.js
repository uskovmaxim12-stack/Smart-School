import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const Gradebook = () => {
  const { user } = useAuthStore();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    fetchMyClasses();
  }, []);

  const fetchMyClasses = async () => {
    // Get teacher's subjects to know classes
    const response = await api.get(`/teacher-subjects?teacher_id=${user.id}`);
    const uniqueClasses = [...new Set(response.data.map(ts => ts.class_id))];
    // fetch class details
    const classPromises = uniqueClasses.map(id => api.get(`/classes/${id}`));
    const classResponses = await Promise.all(classPromises);
    setClasses(classResponses.map(r => r.data));
  };

  const loadClassData = async (classId, subjectId) => {
    const studentsRes = await api.get(`/classes/${classId}/students`); // we need endpoint
    setStudents(studentsRes.data);
    // fetch grades for this class/subject? We'll need to get lessons and grades
    const lessonsRes = await api.get(`/schedule?class_id=${classId}&subject_id=${subjectId}`);
    // For simplicity, we'll just display a table
  };

  return (
    <div>
      <h1>Журнал</h1>
      <div>
        <label>Класс:</label>
        <select onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">Выберите класс</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {selectedClass && (
        <div>
          <label>Предмет:</label>
          <select onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">Выберите предмет</option>
            {/* fetch subjects for this class and teacher */}
          </select>
        </div>
      )}
      {selectedClass && selectedSubject && (
        <table>
          <thead>
            <tr>
              <th>Ученик</th>
              <th>Оценки</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.first_name} {student.last_name}</td>
                <td>
                  {/* input for grade */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Gradebook;
