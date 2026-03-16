const express = require('express');
const router = express.Router();
const { login, refresh, logout, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

router.post('/login', validate(Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() })), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', validate(Joi.object({ email: Joi.string().email().required() })), forgotPassword);
router.post('/reset-password', validate(Joi.object({ token: Joi.string().required(), newPassword: Joi.string().min(6).required() })), resetPassword);

module.exports = router;
