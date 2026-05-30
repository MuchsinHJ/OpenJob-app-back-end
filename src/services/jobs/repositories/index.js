import pg from 'pg';
import { nanoid } from 'nanoid';
import { NotFoundError } from '../../../exceptions/index.js';

const { Pool } = pg;
const pool = new Pool();

const addJob = async (payload) => {
  const id = `job-${nanoid(16)}`;
  const {
    company_id, category_id, title, description,
    job_type, experience_level, location_type, location_city,
    salary_min, salary_max, is_salary_visible, status,
  } = payload;

  const query = {
    text: `INSERT INTO jobs (id, company_id, category_id, title, description,
           job_type, experience_level, location_type, location_city,
           salary_min, salary_max, is_salary_visible, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
    values: [
      id, company_id, category_id, title, description || null,
      job_type || null, experience_level || null, location_type || null,
      location_city || null, salary_min || null, salary_max || null,
      is_salary_visible !== undefined ? is_salary_visible : true,
      status || 'open',
    ],
  };
  const result = await pool.query(query);
  return result.rows[0].id;
};

const getAllJobs = async ({ title, companyName } = {}) => {
  const query = {
    text: `SELECT jobs.*, companies.name AS company_name, categories.name AS category_name
           FROM jobs
           LEFT JOIN companies ON jobs.company_id = companies.id
           LEFT JOIN categories ON jobs.category_id = categories.id
           WHERE 1=1
             AND ($1::text IS NULL OR jobs.title ILIKE '%' || $1 || '%')
             AND ($2::text IS NULL OR companies.name ILIKE '%' || $2 || '%')
           ORDER BY jobs.created_at DESC`,
    values: [title || null, companyName || null],
  };
  const result = await pool.query(query);
  return result.rows;
};

const getJobById = async (id) => {
  const query = {
    text: `SELECT jobs.*, companies.name AS company_name, categories.name AS category_name
           FROM jobs
           LEFT JOIN companies ON jobs.company_id = companies.id
           LEFT JOIN categories ON jobs.category_id = categories.id
           WHERE jobs.id = $1`,
    values: [id],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Job tidak ditemukan');
  }
  return result.rows[0];
};

const getJobsByCompanyId = async (companyId) => {
  const query = {
    text: `SELECT jobs.*, companies.name AS company_name, categories.name AS category_name
           FROM jobs
           LEFT JOIN companies ON jobs.company_id = companies.id
           LEFT JOIN categories ON jobs.category_id = categories.id
           WHERE jobs.company_id = $1
           ORDER BY jobs.created_at DESC`,
    values: [companyId],
  };
  const result = await pool.query(query);
  return result.rows;
};

const getJobsByCategoryId = async (categoryId) => {
  const query = {
    text: `SELECT jobs.*, companies.name AS company_name, categories.name AS category_name
           FROM jobs
           LEFT JOIN companies ON jobs.company_id = companies.id
           LEFT JOIN categories ON jobs.category_id = categories.id
           WHERE jobs.category_id = $1
           ORDER BY jobs.created_at DESC`,
    values: [categoryId],
  };
  const result = await pool.query(query);
  return result.rows;
};

const updateJob = async (id, payload) => {
  const {
    company_id, category_id, title, description,
    job_type, experience_level, location_type, location_city,
    salary_min, salary_max, is_salary_visible, status,
  } = payload;

  const query = {
    text: `UPDATE jobs SET
           company_id = COALESCE($1, company_id),
           category_id = COALESCE($2, category_id),
           title = COALESCE($3, title),
           description = COALESCE($4, description),
           job_type = COALESCE($5, job_type),
           experience_level = COALESCE($6, experience_level),
           location_type = COALESCE($7, location_type),
           location_city = COALESCE($8, location_city),
           salary_min = COALESCE($9, salary_min),
           salary_max = COALESCE($10, salary_max),
           is_salary_visible = COALESCE($11, is_salary_visible),
           status = COALESCE($12, status),
           updated_at = NOW()
           WHERE id = $13 RETURNING id`,
    values: [
      company_id, category_id, title, description,
      job_type, experience_level, location_type, location_city,
      salary_min, salary_max, is_salary_visible, status, id,
    ],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Job tidak ditemukan');
  }
  return result.rows[0].id;
};

const deleteJob = async (id) => {
  const query = {
    text: 'DELETE FROM jobs WHERE id = $1',
    values: [id],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Job tidak ditemukan');
  }
};

export {
  addJob, getAllJobs, getJobById, getJobsByCompanyId,
  getJobsByCategoryId, updateJob, deleteJob,
};
