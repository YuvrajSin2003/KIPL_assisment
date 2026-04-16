const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Employee, Session } = require('../models');
const { SESSION_TIMEOUT_MS } = require('../middleware/auth');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const employee = await Employee.findOne({ where: { username, is_active: true } });
    if (!employee) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, employee.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    await Session.update(
      { is_valid: false },
      { where: { employee_id: employee.id, is_valid: true } }
    );

    const now = new Date();
    const token = uuidv4() + '-' + uuidv4(); 
    const expiresAt = new Date(now.getTime() + SESSION_TIMEOUT_MS);

    await Session.create({
      employee_id: employee.id,
      token,
      last_activity: now,
      expires_at: expiresAt,
      is_valid: true,
    });

    return res.status(200).json({
      message: 'Login successful.',
      token,
      employee: {
        id: employee.id,
        username: employee.username,
        full_name: employee.full_name,
        email: employee.email,
        department: employee.department,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const logout = async (req, res) => {
  try {
    await req.session.update({ is_valid: false });
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const me = async (req, res) => {
  const emp = req.employee;
  return res.status(200).json({
    employee: {
      id: emp.id,
      username: emp.username,
      full_name: emp.full_name,
      email: emp.email,
      department: emp.department,
    },
  });
};

module.exports = { login, logout, me };
