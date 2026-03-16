const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const classRoutes = require('./routes/class.routes');
const subjectRoutes = require('./routes/subject.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const gradeRoutes = require('./routes/grade.routes');
const homeworkRoutes = require('./routes/homework.routes');
const materialRoutes = require('./routes/material.routes');
const chatRoutes = require('./routes/chat.routes');
const notificationRoutes = require('./routes/notification.routes');
const aiRoutes = require('./routes/ai.routes');
const reportRoutes = require('./routes/report.routes');
const adminRoutes = require('./routes/admin.routes');

const { errorHandler } = require('./middleware/errorHandler');
const { authenticate } = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/classes', authenticate, classRoutes);
app.use('/api/subjects', authenticate, subjectRoutes);
app.use('/api/schedule', authenticate, scheduleRoutes);
app.use('/api/grades', authenticate, gradeRoutes);
app.use('/api/homeworks', authenticate, homeworkRoutes);
app.use('/api/materials', authenticate, materialRoutes);
app.use('/api/chats', authenticate, chatRoutes);
app.use('/api/notifications', authenticate, notificationRoutes);
app.use('/api/ai', authenticate, aiRoutes);
app.use('/api/reports', authenticate, reportRoutes);
app.use('/api/admin', authenticate, adminRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
