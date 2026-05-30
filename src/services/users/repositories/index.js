import pg from 'pg';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';

const { Pool } = pg;
const pool = new Pool();

const addUser = async ({ name, email, password, role }) => {
  // Check email uniqueness
  const checkQuery = {
    text: 'SELECT id FROM users WHERE email = $1',
    values: [email],
  };
  const checkResult = await pool.query(checkQuery);
  if (checkResult.rowCount > 0) {
    throw new InvariantError('Email sudah digunakan');
  }

  const id = `user-${nanoid(16)}`;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = {
    text: `INSERT INTO users (id, name, email, password, role)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    values: [id, name, email, hashedPassword, role],
  };

  const result = await pool.query(query);
  return result.rows[0].id;
};

const getUserById = async (id) => {
  const query = {
    text: 'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
    values: [id],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('User tidak ditemukan');
  }
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const query = {
    text: 'SELECT id, name, email, password, role FROM users WHERE email = $1',
    values: [email],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Email tidak ditemukan');
  }
  return result.rows[0];
};

export { addUser, getUserById, getUserByEmail };
