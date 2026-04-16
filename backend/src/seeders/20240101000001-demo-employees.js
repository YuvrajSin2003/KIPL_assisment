'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const salt = await bcrypt.genSalt(10);

    const employees = [
      {
        id: uuidv4(),
        username: 'john.doe',
        password_hash: await bcrypt.hash('password123', salt),
        full_name: 'John Doe',
        email: 'john.doe@company.com',
        department: 'Engineering',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        username: 'jane.smith',
        password_hash: await bcrypt.hash('password123', salt),
        full_name: 'Jane Smith',
        email: 'jane.smith@company.com',
        department: 'HR',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        username: 'alice.wang',
        password_hash: await bcrypt.hash('password123', salt),
        full_name: 'Alice Wang',
        email: 'alice.wang@company.com',
        department: 'Design',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('employees', employees, {});
    console.log('✅ Seeded demo employees (password: password123 for all)');
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('employees', null, {});
  },
};
