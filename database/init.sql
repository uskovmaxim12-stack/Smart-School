-- Создание типов ENUM
CREATE TYPE user_role AS ENUM ('admin', 'director', 'head_teacher', 'teacher', 'student', 'parent');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE chat_type AS ENUM ('class', 'custom');
CREATE TYPE notification_type AS ENUM ('grade', 'homework', 'message', 'announcement');

-- Таблица пользователей
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- Таблица классов
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(10) NOT NULL,
  grade INT NOT NULL,
  academic_year VARCHAR(9) NOT NULL,
  homeroom_teacher_id INT REFERENCES users(id) ON DELETE SET NULL
);

-- Таблица учеников
CREATE TABLE students (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  class_id INT REFERENCES classes(id) ON DELETE SET NULL
);

-- Таблица учителей
CREATE TABLE teachers (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
);

-- Таблица родителей
CREATE TABLE parents (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
);

-- Связь родитель-ученик
CREATE TABLE parent_student (
  parent_id INT REFERENCES parents(user_id) ON DELETE CASCADE,
  student_id INT REFERENCES students(user_id) ON DELETE CASCADE,
  PRIMARY KEY (parent_id, student_id)
);

-- Таблица предметов
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- Нагрузка учителей
CREATE TABLE teacher_subjects (
  id SERIAL PRIMARY KEY,
  teacher_id INT REFERENCES teachers(user_id) ON DELETE CASCADE,
  subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
  class_id INT REFERENCES classes(id) ON DELETE CASCADE,
  UNIQUE(teacher_id, subject_id, class_id)
);

-- Расписание уроков
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES classes(id) ON DELETE CASCADE,
  subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id INT REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
  lesson_number INT CHECK (lesson_number BETWEEN 1 AND 8),
  room VARCHAR(10),
  start_time TIME,
  end_time TIME
);

-- Исключения в расписании (замены)
CREATE TABLE schedule_exceptions (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
  new_teacher_id INT REFERENCES users(id) ON DELETE SET NULL,
  new_room VARCHAR(10)
);

-- Домашние задания
CREATE TABLE homeworks (
  id SERIAL PRIMARY KEY,
  lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  attachments JSONB DEFAULT '[]',
  created_by INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Сданные домашние задания
CREATE TABLE homework_submissions (
  id SERIAL PRIMARY KEY,
  homework_id INT REFERENCES homeworks(id) ON DELETE CASCADE,
  student_id INT REFERENCES students(user_id) ON DELETE CASCADE,
  file_path TEXT,
  comment TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  grade INT,
  graded_by INT REFERENCES users(id) ON DELETE SET NULL,
  graded_at TIMESTAMP
);

-- Оценки
CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(user_id) ON DELETE CASCADE,
  lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
  value VARCHAR(5) NOT NULL, -- может быть число или буква
  comment TEXT,
  date DATE NOT NULL,
  created_by INT REFERENCES users(id) ON DELETE SET NULL
);

-- Посещаемость
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(user_id) ON DELETE CASCADE,
  lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
  status attendance_status NOT NULL,
  date DATE NOT NULL
);

-- Учебные материалы
CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id INT REFERENCES users(id) ON DELETE SET NULL,
  class_id INT REFERENCES classes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Личные сообщения (диалоги)
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_user_id INT REFERENCES users(id) ON DELETE CASCADE,
  to_user_id INT REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false
);

-- Групповые чаты
CREATE TABLE group_chats (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  type chat_type NOT NULL,
  created_by INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Участники групповых чатов
CREATE TABLE chat_members (
  chat_id INT REFERENCES group_chats(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (chat_id, user_id)
);

-- Сообщения в групповых чатах
CREATE TABLE group_messages (
  id SERIAL PRIMARY KEY,
  chat_id INT REFERENCES group_chats(id) ON DELETE CASCADE,
  from_user_id INT REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Уведомления
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  content TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- База знаний ИИ
CREATE TABLE ai_knowledge_base (
  id SERIAL PRIMARY KEY,
  keywords TEXT[] NOT NULL,
  question_pattern TEXT,
  answer_template TEXT NOT NULL,
  subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
  grade INT
);

-- История диалогов с ИИ
CREATE TABLE ai_conversations (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Логи действий
CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Системные настройки
CREATE TABLE system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL
);

-- Индексы
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_lessons_class ON lessons(class_id);
CREATE INDEX idx_lessons_teacher ON lessons(teacher_id);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_homeworks_due ON homeworks(due_date);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_logs_created_at ON logs(created_at);
CREATE INDEX idx_ai_keywords ON ai_knowledge_base USING GIN(keywords);
