const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  employee_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  check_in_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  check_out_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  total_hours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('checked_in', 'checked_out'),
    allowNull: false,
    defaultValue: 'checked_in',
  },
}, {
  tableName: 'attendance',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['employee_id', 'date'],
      name: 'unique_employee_date',
    },
  ],
});

module.exports = Attendance;
