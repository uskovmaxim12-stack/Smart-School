const Notification = require('../models/notification.model');

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findForUser(req.user.id);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    await Notification.markAsRead(req.params.id);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    next(err);
  }
};

const deleteRead = async (req, res, next) => {
  try {
    await Notification.deleteRead(req.user.id);
    res.json({ message: 'Deleted read notifications' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markAsRead, deleteRead };
