import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '100.25.81.7',
  user: process.env.DB_USER || 'Foodly',
  password: process.env.DB_PASS || 'Passw0rd!2026',
  database: process.env.DB_SCHEMA || 'vors_users',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONN_LIMIT || '10', 10),
  queueLimit: 0,
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    conn.release();
    return null;
  } catch (err: any) {
    return err.message || String(err);
  }
}

async function executePreparedQuery(query: string, params: any[] = []) {
  const [result] = await pool.execute(query, params);
  return result;
}

async function fetchRows(query: string, params: any[] = []) {
  const [rows] = await pool.execute(query, params);
  return rows;
}

export default {
  pool,
  testConnection,
  executePreparedQuery,
  fetchRows,
};