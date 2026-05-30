import pg from 'pg';
import { NotFoundError, InvariantError } from '../../../exceptions/index.js';

const { Pool } = pg;
const pool = new Pool();

const addToken = async (token) => {
  const query = {
    text: 'INSERT INTO authentications (token) VALUES ($1)',
    values: [token],
  };
  await pool.query(query);
};

const findToken = async (token) => {
  const query = {
    text: 'SELECT token FROM authentications WHERE token = $1',
    values: [token],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new NotFoundError('Refresh token tidak ditemukan');
  }
};

const deleteToken = async (token) => {
  const query = {
    text: 'DELETE FROM authentications WHERE token = $1',
    values: [token],
  };
  const result = await pool.query(query);
  if (!result.rowCount) {
    throw new InvariantError('Refresh token tidak ditemukan di database');
  }
};

export { addToken, findToken, deleteToken };
