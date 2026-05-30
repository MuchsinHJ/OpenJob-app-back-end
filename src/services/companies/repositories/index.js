import pg from 'pg';
import { nanoid } from 'nanoid';
import { NotFoundError } from '../../../exceptions/index.js';

const { Pool } = pg;
const pool = new Pool();

const addCompany = async ({ name, location, description }) => {
  const id = `company-${nanoid(16)}`;
  const query = {
    text: `INSERT INTO companies (id, name, location, description)
           VALUES ($1, $2, $3, $4) RETURNING id`,
    values: [id, name, location || null, description || null],
  };
  const result = await pool.query(query);
  return result.rows[0].id;
};

const getAllCompanies = async () => {
  const result = await pool.query('SELECT * FROM companies ORDER BY created_at DESC');
  return result.rows;
};

const getCompanyById = async (id) => {
  const query = {
    text: 'SELECT * FROM companies WHERE id = $1',
    values: [id],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Company tidak ditemukan');
  }
  return result.rows[0];
};

const updateCompany = async (id, { name, location, description }) => {
  const query = {
    text: `UPDATE companies SET name = COALESCE($1, name), location = COALESCE($2, location),
           description = COALESCE($3, description), updated_at = NOW()
           WHERE id = $4 RETURNING id`,
    values: [name, location, description, id],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Company tidak ditemukan');
  }
  return result.rows[0].id;
};

const deleteCompany = async (id) => {
  const query = {
    text: 'DELETE FROM companies WHERE id = $1',
    values: [id],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Company tidak ditemukan');
  }
};

export { addCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany };
