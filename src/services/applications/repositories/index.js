import pg from 'pg';
import { nanoid } from 'nanoid';
import { NotFoundError } from '../../../exceptions/index.js';

const { Pool } = pg;
const pool = new Pool();

const addApplication = async ({ user_id, job_id }) => {
  const id = `app-${nanoid(16)}`;
  const query = {
    text: `INSERT INTO applications (id, user_id, job_id, status)
           VALUES ($1, $2, $3, 'pending') RETURNING id`,
    values: [id, user_id, job_id],
  };
  const result = await pool.query(query);
  return result.rows[0].id;
};

const getAllApplications = async () => {
  const query = `SELECT applications.*, users.name AS user_name, jobs.title AS job_title
                 FROM applications
                 LEFT JOIN users ON applications.user_id = users.id
                 LEFT JOIN jobs ON applications.job_id = jobs.id
                 ORDER BY applications.created_at DESC`;
  const result = await pool.query(query);
  return result.rows;
};

const getApplicationById = async (id) => {
  const query = {
    text: `SELECT applications.*, users.name AS user_name, jobs.title AS job_title
           FROM applications
           LEFT JOIN users ON applications.user_id = users.id
           LEFT JOIN jobs ON applications.job_id = jobs.id
           WHERE applications.id = $1`,
    values: [id],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Application tidak ditemukan');
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

const getApplicationsByJobId = async (jobId) => {
  const query = {
    text: `SELECT applications.*, users.name AS user_name
           FROM applications
           LEFT JOIN users ON applications.user_id = users.id
           WHERE applications.job_id = $1
           ORDER BY applications.created_at DESC`,
    values: [jobId],
  };
  const result = await pool.query(query);
  return result.rows;
};

const updateApplicationStatus = async (id, status) => {
  const query = {
    text: 'UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
    values: [status, id],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Application tidak ditemukan');
  }
  return result.rows[0].id;
};

const deleteApplication = async (id) => {
  const query = {
    text: 'DELETE FROM applications WHERE id = $1',
    values: [id],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Application tidak ditemukan');
  }
};

export {
  addApplication, getAllApplications, getApplicationById,
  getApplicationsByUserId, getApplicationsByJobId,
  updateApplicationStatus, deleteApplication,
};
