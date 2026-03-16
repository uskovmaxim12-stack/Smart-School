const STORAGE_KEY = 'smart_school_users';
const GRADES_KEY = 'smart_school_grades';
const SCHEDULE_KEY = 'smart_school_schedule';
const HOMEWORKS_KEY = 'smart_school_homeworks';
const CHATS_KEY = 'smart_school_chats';
const AI_KNOWLEDGE_KEY = 'smart_school_ai_knowledge';

// Начальные пользователи (включая админа по запросу)
const defaultUsers = [
  {
    id: 1,
    email: 'uskovmaxim12@gmail.com',
    password: '140612',
    role: 'admin',
    firstName: 'Максим',
    lastName: 'Усков',
  },
  {
    id: 2,
    email: 'teacher@school.com',
    password: 'teacher123',
    role: 'teacher',
    firstName: 'Иван',
    lastName: 'Петров',
  },
  {
    id: 3,
    email: 'student@school.com',
    password: 'student123',
    role: 'student',
    firstName: 'Анна',
    lastName: 'Смирнова',
    classId: 1,
  },
  {
    id: 4,
    email: 'parent@school.com',
    password: 'parent123',
    role: 'parent',
    firstName: 'Елена',
    lastName: 'Смирнова',
    children: [3],
  },
];

// Инициализация
const init = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem(GRADES_KEY)) {
    localStorage.setItem(GRADES_KEY, JSON.stringify([
      { id: 1, studentId: 3, subject: 'Математика', value: 5, date: '2025-03-10' },
      { id: 2, studentId: 3, subject: 'Русский язык', value: 4, date: '2025-03-09' },
    ]));
  }
  if (!localStorage.getItem(SCHEDULE_KEY)) {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify([
      { id: 1, classId: 1, dayOfWeek: 1, lessonNumber: 1, subject: 'Математика', teacher: 'Иван Петров', room: '101' },
      { id: 2, classId: 1, dayOfWeek: 1, lessonNumber: 2, subject: 'Русский язык', teacher: 'Иван Петров', room: '102' },
    ]));
  }
  if (!localStorage.getItem(HOMEWORKS_KEY)) {
    localStorage.setItem(HOMEWORKS_KEY, JSON.stringify([
      { id: 1, classId: 1, subject: 'Математика', title: 'Решить уравнения', dueDate: '2025-03-20', description: '№ 15-20' },
    ]));
  }
  if (!localStorage.getItem(CHATS_KEY)) {
    localStorage.setItem(CHATS_KEY, JSON.stringify([
      { id: 1, name: 'Общий чат класса', type: 'class', members: [1,2,3], messages: [
        { id: 1, fromUserId: 2, content: 'Привет, класс!', timestamp: '2025-03-15T10:00' }
      ]}
    ]));
  }
  if (!localStorage.getItem(AI_KNOWLEDGE_KEY)) {
    localStorage.setItem(AI_KNOWLEDGE_KEY, JSON.stringify([
      { keywords: ['привет', 'здравствуй'], answer: 'Здравствуйте! Чем могу помочь?' },
      { keywords: ['математика', 'формула'], answer: 'Математика — царица наук. Какую тему вы изучаете?' },
    ]));
  }
};
init();

const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEY));
const saveUsers = (users) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

export const mockApi = {
  login: async (email, password, role) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },
  register: async ({ firstName, lastName, email, password, role }) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) return null;
    const newUser = {
      id: users.length + 1,
      email,
      password,
      role,
      firstName,
      lastName,
    };
    users.push(newUser);
    saveUsers(users);
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },
  // Методы для данных
  getGrades: (studentId) => {
    const grades = JSON.parse(localStorage.getItem(GRADES_KEY)) || [];
    return grades.filter(g => g.studentId === studentId);
  },
  getSchedule: (classId) => {
    const schedule = JSON.parse(localStorage.getItem(SCHEDULE_KEY)) || [];
    return schedule.filter(s => s.classId === classId);
  },
  getHomeworks: (classId) => {
    const homeworks = JSON.parse(localStorage.getItem(HOMEWORKS_KEY)) || [];
    return homeworks.filter(h => h.classId === classId);
  },
  getChats: (userId) => {
    const chats = JSON.parse(localStorage.getItem(CHATS_KEY)) || [];
    return chats.filter(c => c.members.includes(userId));
  },
  getAIContext: () => {
    return JSON.parse(localStorage.getItem(AI_KNOWLEDGE_KEY)) || [];
  },
};
