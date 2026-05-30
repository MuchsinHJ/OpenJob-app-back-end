import pg from 'pg';
import { nanoid } from 'nanoid';
import { NotFoundError } from '../../../exceptions/index.js';

const { Pool } = pg;
const pool = new Pool();

const addBookmark = async ({ user_id, job_id }) => {
  const id = `bookmark-${nanoid(16)}`;
  const query = {
    text: 'INSERT INTO bookmarks (id, user_id, job_id) VALUES ($1, $2, $3) RETURNING id',
    values: [id, user_id, job_id],
  };
  const result = await pool.query(query);
  return result.rows[0].id;
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

const getBookmarkById = async (id) => {
  const query = {
    text: `SELECT bookmarks.*, jobs.title AS job_title
           FROM bookmarks
           LEFT JOIN jobs ON bookmarks.job_id = jobs.id
           WHERE bookmarks.id = $1`,
    values: [id],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Bookmark tidak ditemukan');
  }
  return result.rows[0];
};

const deleteBookmarkByUserAndJob = async (userId, jobId) => {
  const query = {
    text: 'DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2',
    values: [userId, jobId],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Bookmark tidak ditemukan');
  }
};

export { addBookmark, getBookmarksByUserId, getBookmarkById, deleteBookmarkByUserAndJob };
