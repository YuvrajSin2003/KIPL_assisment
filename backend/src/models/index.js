const sequelize = require('../config/sequelize');
const Employee = require('./Employee');
const Session = require('./Session');
const Attendance = require('./Attendance');
const LeaveRequest = require('./LeaveRequest');

Employee.hasMany(Session, { foreignKey: 'employee_id', as: 'sessions', onDelete: 'CASCADE' });
Session.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

Employee.hasMany(Attendance, { foreignKey: 'employee_id', as: 'attendances', onDelete: 'CASCADE' });
Attendance.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

Employee.hasMany(LeaveRequest, { foreignKey: 'employee_id', as: 'leaveRequests', onDelete: 'CASCADE' });
LeaveRequest.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

module.exports = { sequelize, Employee, Session, Attendance, LeaveRequest };
