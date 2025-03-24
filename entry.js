'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');
const app = express();

// Middlewares
const morgan = require('morgan')
app.use(morgan('combined'))

// Enable CORS for all routes
app.use(cors());

// Body Parser
app.use(bodyParser.json({ limit: '50mb', extended: false }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

// Headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
  next();
});

const {connectDatabase} = require("../database/database");
connectDatabase().then(res => {
  console.log('Database Connected.');
});

// Default Routes - Static file + index.html handler
app.use(express.static(path.join(path.resolve(), 'dist')));
app.get('/', function(req, res) {
  res.sendFile(path.join(process.cwd(), 'dist/index.html'));
});

// Routes
const {DeleteUser, UpdateUser, GetUserById, CreateUser, GetUsers} = require("../controllers/user");
const {Login} = require("../controllers/auth");
const {GetAnnouncements, CreateAnnouncement, GetAnnouncementById, UpdateAnnouncement, DeleteAnnouncement} = require("../controllers/announcement");
const {GetAttendances, CreateAttendance, GetAttendanceById, UpdateAttendance, DeleteAttendance} = require("../controllers/attendance");
const {DeleteTask, UpdateTask, GetTaskById, CreateTask, GetTasks} = require("../controllers/task");
const {DeleteSetting, UpdateSetting, GetSettingById, CreateSetting, GetSettings, GetSetting} = require("../controllers/setting");
const {DeleteProject, UpdateProject, GetProjectById, CreateProject, GetProjects} = require("../controllers/project");
const {DeleteLeave, UpdateLeave, GetLeaveById, CreateLeave, GetLeaves} = require("../controllers/leave");
const {DeleteExpense, UpdateExpense, GetExpenseById, CreateExpense, GetExpenses} = require("../controllers/expense");
const {DeleteDesignation, UpdateDesignation, GetDesignationById, CreateDesignation, GetDesignations} = require("../controllers/designation");
const {DeleteDepartment, UpdateDepartment, GetDepartmentById, CreateDepartment, GetDepartments} = require("../controllers/department");
const {AuthMiddleware} = require("../middleware/auth");
const {Initial, Install} = require("../controllers/general");
const {GetNotifications} = require("../controllers/notification");

app.get('/api/version', function(req, res) {
  res.status(200).json({
    data: {
      node_version: process.version,
      version: process.env.VERSION
    }
  })
});

app.get('/api/initial', Initial);
app.post('/api/install', Install);
app.post('/api/login', Login);

app.use('/api/announcement', AuthMiddleware);
app.get('/api/announcement', GetAnnouncements);
app.post('/api/announcement', CreateAnnouncement);
app.get('/api/announcement/:id', GetAnnouncementById);
app.put('/api/announcement/:id', UpdateAnnouncement);
app.delete('/api/announcement/:ids', DeleteAnnouncement);

app.use('/api/attendance', AuthMiddleware);
app.get('/api/attendance', GetAttendances);
app.post('/api/attendance', CreateAttendance);
app.get('/api/attendance/:id', GetAttendanceById);
app.put('/api/attendance/:id', UpdateAttendance);
app.delete('/api/attendance/:ids', DeleteAttendance);

app.use('/api/department', AuthMiddleware);
app.get('/api/department', GetDepartments);
app.post('/api/department', CreateDepartment);
app.get('/api/department/:id', GetDepartmentById);
app.put('/api/department/:id', UpdateDepartment);
app.delete('/api/department/:ids', DeleteDepartment);

app.use('/api/designation', AuthMiddleware);
app.get('/api/designation', GetDesignations);
app.post('/api/designation', CreateDesignation);
app.get('/api/designation/:id', GetDesignationById);
app.put('/api/designation/:id', UpdateDesignation);
app.delete('/api/designation/:ids', DeleteDesignation);

app.use('/api/expense', AuthMiddleware);
app.get('/api/expense', GetExpenses);
app.post('/api/expense', CreateExpense);
app.get('/api/expense/:id', GetExpenseById);
app.put('/api/expense/:id', UpdateExpense);
app.delete('/api/expense/:ids', DeleteExpense);

app.use('/api/leave', AuthMiddleware);
app.get('/api/leave', GetLeaves);
app.post('/api/leave', CreateLeave);
app.get('/api/leave/:id', GetLeaveById);
app.put('/api/leave/:id', UpdateLeave);
app.delete('/api/leave/:ids', DeleteLeave);

app.use('/api/notification', AuthMiddleware);
app.get('/api/notification', GetNotifications);
// app.post('/api/notification', CreateNotification);
// app.get('/api/notification/:id', GetNotificationById);
// app.put('/api/notification/:id', UpdateNotification);
// app.delete('/api/notification/:ids', DeleteNotification);

app.use('/api/project', AuthMiddleware);
app.get('/api/project', GetProjects);
app.post('/api/project', CreateProject);
app.get('/api/project/:id', GetProjectById);
app.put('/api/project/:id', UpdateProject);
app.delete('/api/project/:ids', DeleteProject);

app.use('/api/setting', AuthMiddleware);
app.get('/api/setting', GetSetting);
app.get('/api/setting/:id', GetSettingById);
app.put('/api/setting/:id', UpdateSetting);
app.delete('/api/setting/:ids', DeleteSetting);

app.use('/api/task', AuthMiddleware);
app.get('/api/task', GetTasks);
app.post('/api/task', CreateTask);
app.get('/api/task/:id', GetTaskById);
app.put('/api/task/:id', UpdateTask);
app.delete('/api/task/:ids', DeleteTask);

app.use('/api/user', AuthMiddleware);
app.get('/api/user', GetUsers);
app.post('/api/user', CreateUser);
app.get('/api/user/:id', GetUserById);
app.put('/api/user/:id', UpdateUser);
app.delete('/api/user/:ids', DeleteUser);

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    data: `Internal server error: ${err}`
  });
});

module.exports = app;
