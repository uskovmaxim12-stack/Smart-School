const Log = require('../models/log.model');
const Settings = require('../models/settings.model');
const os = require('os');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const getLogs = async (req, res, next) => {
  try {
    const filters = req.query;
    const logs = await Log.findAll(filters);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

const getBackup = (req, res, next) => {
  // Simple backup: run pg_dump and send file
  const db = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;

  // WARNING: In production, use proper escaping or a library
  const dumpCmd = `pg_dump postgresql://${user}:${password}@${host}:${port}/${db}`;

  exec(dumpCmd, (error, stdout, stderr) => {
    if (error) {
      console.error('Backup error:', error);
      return res.status(500).json({ message: 'Backup failed' });
    }
    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', 'attachment; filename=backup.sql');
    res.send(stdout);
  });
};

const getServerStats = (req, res) => {
  const stats = {
    cpu: os.loadavg(),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
    },
    uptime: os.uptime(),
  };
  res.json(stats);
};

const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getAll();
    res.json(settings);
  } catch (err) {
    next(err);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    await Settings.set(key, value);
    res.json({ message: 'Settings updated' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLogs, getBackup, getServerStats, getSettings, updateSettings };
