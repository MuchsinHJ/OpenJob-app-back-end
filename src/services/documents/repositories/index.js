import pg from 'pg';
import { nanoid } from 'nanoid';
import { NotFoundError } from '../../../exceptions/index.js';

const { Pool } = pg;
const pool = new Pool();

const addDocument = async ({ user_id, filename, filepath }) => {
  const id = `doc-${nanoid(16)}`;
  const query = {
    text: 'INSERT INTO documents (id, user_id, filename, filepath) VALUES ($1, $2, $3, $4) RETURNING id',
    values: [id, user_id, filename, filepath],
  };
  const result = await pool.query(query);
  return result.rows[0].id;
};

const getAllDocuments = async () => {
  const query = `SELECT documents.*, users.name AS user_name
                 FROM documents
                 LEFT JOIN users ON documents.user_id = users.id
                 ORDER BY documents.created_at DESC`;
  const result = await pool.query(query);
  return result.rows;
};

const getDocumentById = async (id) => {
  const query = {
    text: `SELECT documents.*, users.name AS user_name
           FROM documents
           LEFT JOIN users ON documents.user_id = users.id
           WHERE documents.id = $1`,
    values: [id],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Document tidak ditemukan');
  }
  return result.rows[0];
};

const deleteDocument = async (id) => {
  const query = {
    text: 'DELETE FROM documents WHERE id = $1',
    values: [id],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Document tidak ditemukan');
  }
};

export { addDocument, getAllDocuments, getDocumentById, deleteDocument };
