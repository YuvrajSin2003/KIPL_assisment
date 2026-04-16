'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      employee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'employees', key: 'id' },
        onDelete: 'CASCADE',
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      check_in_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      check_out_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      total_hours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('checked_in', 'checked_out'),
        allowNull: false,
        defaultValue: 'checked_in',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addConstraint('attendance', {
      fields: ['employee_id', 'date'],
      type: 'unique',
      name: 'unique_employee_date',
    });

    await queryInterface.addIndex('attendance', ['employee_id']);
    await queryInterface.addIndex('attendance', ['date']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('attendance');
  },
};
