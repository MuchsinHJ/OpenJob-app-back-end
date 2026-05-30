import pg from 'pg';
import { nanoid } from 'nanoid';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';

const { Pool } = pg;
const pool = new Pool();

const addCategory = async ({ name }) => {
  // Check name uniqueness
  const check = await pool.query('SELECT id FROM categories WHERE name = $1', [name]);
  if (check.rowCount > 0) {
    throw new InvariantError('Nama kategori sudah digunakan');
  }

  const id = `category-${nanoid(16)}`;
  const query = {
    text: 'INSERT INTO categories (id, name) VALUES ($1, $2) RETURNING id',
    values: [id, name],
  };
  const result = await pool.query(query);
  return result.rows[0].id;
};

const getAllCategories = async () => {
  const result = await pool.query('SELECT * FROM categories ORDER BY created_at DESC');
  return result.rows;
};

const getCategoryById = async (id) => {
  const query = {
    text: 'SELECT * FROM categories WHERE id = $1',
    values: [id],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Category tidak ditemukan');
  }
  return result.rows[0];
};

const updateCategory = async (id, { name }) => {
  // Check name uniqueness (exclude self)
  const check = await pool.query('SELECT id FROM categories WHERE name = $1 AND id != $2', [name, id]);
  if (check.rowCount > 0) {
    throw new InvariantError('Nama kategori sudah digunakan');
  }

  const query = {
    text: 'UPDATE categories SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
    values: [name, id],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Category tidak ditemukan');
  }
  return result.rows[0].id;
};

const deleteCategory = async (id) => {
  const query = {
    text: 'DELETE FROM categories WHERE id = $1',
    values: [id],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Category tidak ditemukan');
  }
};

export { addCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };
