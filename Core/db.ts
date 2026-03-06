import dotenv from 'dotenv';
import mysql, { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';

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
  authPlugins: {
    mysql_native_password: () => () => process.env.DB_PASS || 'Passw0rd!2026',
  },
});

async function testConnection(): Promise<string | null> {
  try {
    const conn = await pool.getConnection();
    conn.release();
    return null;
  } catch (err: any) {
    return err.message || String(err);
  }
}

async function executePreparedQuery(query: string, params: any[] = []): Promise<RowDataPacket[] | ResultSetHeader> {
  const [result] = await pool.execute(query, params);
  return result as RowDataPacket[] | ResultSetHeader;
}

async function fetchRows(query: string, params: any[] = []): Promise<RowDataPacket[]> {
  const [rows] = await pool.execute(query, params);
  return rows as RowDataPacket[];
}

export default {
  pool,
  testConnection,
  executePreparedQuery,
  fetchRows,
};