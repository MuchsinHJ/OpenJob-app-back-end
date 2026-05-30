import pg from 'pg';
import { NotFoundError } from '../../../exceptions/index.js';

const { Pool } = pg;
const pool = new Pool();

const getUserProfile = async (userId) => {
  const query = {
    text: 'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
    values: [userId],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('User tidak ditemukan');
  }
  return result.rows[0];
};

const getApplicationsByUserId = async (userId) => {
  const query = {
    text: `SELECT applications.*, jobs.title AS job_title, companies.name AS company_name
           FROM applications
           LEFT JOIN jobs ON applications.job_id = jobs.id
           LEFT JOIN companies ON jobs.company_id = companies.id
           WHERE applications.user_id = $1
           ORDER BY applications.created_at DESC`,
    values: [userId],
  };
  const result = await pool.query(query);
  return result.rows;
};

const getBookmarksByUserId = async (userId) => {
  const query = {
    text: `SELECT bookmarks.*, jobs.title AS job_title, companies.name AS company_name
           FROM bookmarks
           LEFT JOIN jobs ON bookmarks.job_id = jobs.id
           LEFT JOIN companies ON jobs.company_id = companies.id
           WHERE bookmarks.user_id = $1
           ORDER BY bookmarks.created_at DESC`,
    values: [userId],
  };
  const result = await pool.query(query);
  return result.rows;
};

export { getUserProfile, getApplicationsByUserId, getBookmarksByUserId };
