// Имитация API с localStorage

const STORAGE_KEY = 'smart_school_users';

const defaultUsers = [
  {
    id: 1,
    email: 'admin@school.com',
    password: 'admin123',
    role: 'admin',
    firstName: 'Админ',
    lastName: 'Админов',
  },
  {
    id: 2,
    email: 'teacher@school.com',
    password: 'teacher123',
    role: 'teacher',
    firstName: 'Иван',
    lastName: 'Учителев',
  },
  {
    id: 3,
    email: 'student@school.com',
    password: 'student123',
    role: 'student',
    firstName: 'Петя',
    lastName: 'Учеников',
  },
  {
    id: 4,
    email: 'parent@school.com',
    password: 'parent123',
    role: 'parent',
    firstName: 'Мария',
    lastName: 'Родителева',
  },
];

// Инициализация
const initData = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  }
};
initData();

const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const saveUsers = (users) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

export const mockApi = {
  login: async (email, password, role) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
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
  logout: () => {
    localStorage.removeItem('currentUser');
  },
};
