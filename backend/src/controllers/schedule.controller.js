const Lesson = require('../models/lesson.model');
const ScheduleException = require('../models/scheduleException.model'); // we'll create similar model

const getSchedule = async (req, res, next) => {
  try {
    const { class_id, teacher_id, week_start } = req.query;
    // For simplicity, we return base lessons; exceptions can be applied later
    if (class_id) {
      const lessons = await Lesson.findByClassAndWeek(class_id);
      res.json(lessons);
    } else if (teacher_id) {
      // implement teacher schedule query
      res.json([]);
    } else {
      res.status(400).json({ message: 'Provide class_id or teacher_id' });
    }
  } catch (err) {
    next(err);
  }
};

const createLesson = async (req, res, next) => {
  try {
    // Check conflicts
    const { teacher_id, day_of_week, lesson_number } = req.body;
    const conflicts = await Lesson.findConflicts(teacher_id, day_of_week, lesson_number);
    if (conflicts.length > 0) {
      return res.status(409).json({ message: 'Teacher already has a lesson at that time' });
    }
    const lesson = await Lesson.create(req.body);
    res.status(201).json(lesson);
  } catch (err) {
    next(err);
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { teacher_id, day_of_week, lesson_number } = req.body;
    // Check conflicts excluding current
    const conflicts = await Lesson.findConflicts(teacher_id, day_of_week, lesson_number, id);
    if (conflicts.length > 0) {
      return res.status(409).json({ message: 'Teacher already has a lesson at that time' });
    }
    const updated = await Lesson.update(id, req.body);
    if (!updated) return res.status(404).json({ message: 'Lesson not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    await Lesson.delete(req.params.id);
    res.json({ message: 'Lesson deleted' });
  } catch (err) {
    next(err);
  }
};

// Replacements (exceptions) can be added similarly

module.exports = { getSchedule, createLesson, updateLesson, deleteLesson };
