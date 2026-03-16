const User = require('../models/user.model');
const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const Parent = require('../models/parent.model');
const Log = require('../models/log.model');
const { generateRandomPassword, sendCredentialsEmail } = require('../utils/email');
const bcrypt = require('bcrypt');

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Fetch role-specific data
    let extra = {};
    if (user.role === 'student') {
      const student = await Student.findByUserId(user.id);
      extra.class_id = student.class_id;
    } else if (user.role === 'parent') {
      const children = await Parent.getChildren(user.id);
      extra.children = children;
    } else if (user.role === 'teacher') {
      const teacher = await Teacher.findByUserId(user.id);
      extra.teacher_id = teacher?.id;
    }
    res.json({ ...user, ...extra });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.class_id) filters.class_id = req.query.class_id;
    const users = await User.getAll(filters);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { email, role, first_name, last_name, class_id, children_ids } = req.body;
    const password = generateRandomPassword();
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed,
      role,
      first_name,
      last_name,
    });

    // Create role-specific entries
    if (role === 'student') {
      await Student.create(user.id, class_id);
    } else if (role === 'teacher') {
      await Teacher.create(user.id);
    } else if (role === 'parent') {
      await Parent.create(user.id);
      if (children_ids && children_ids.length) {
        for (const childId of children_ids) {
          await Parent.linkToStudent(user.id, childId);
        }
      }
    } else if (role === 'admin' || role === 'director' || role === 'head_teacher') {
      // No extra table needed
    }

    // Send email with credentials
    await sendCredentialsEmail(email, password);

    await Log.create({ user_id: req.user.id, action: 'USER_CREATED', details: { createdUserId: user.id }, ip: req.ip });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allowedFields = ['first_name', 'last_name', 'avatar_url'];
    if (req.user.role === 'admin') {
      // Admin can update more fields, but we'll keep it simple
      allowedFields.push('email', 'role');
    }
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    const updated = await User.update(id, updates);
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await User.delete(req.params.id);
    await Log.create({ user_id: req.user.id, action: 'USER_DELETED', details: { deletedUserId: req.params.id }, ip: req.ip });
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

const blockUser = async (req, res, next) => {
  try {
    await User.block(req.params.id, true);
    res.json({ message: 'User blocked' });
  } catch (err) {
    next(err);
  }
};

const unblockUser = async (req, res, next) => {
  try {
    await User.block(req.params.id, false);
    res.json({ message: 'User unblocked' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe, getAllUsers, getUserById, createUser, updateUser, deleteUser, blockUser, unblockUser };
