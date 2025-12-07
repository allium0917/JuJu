import pkg from 'pg';
import 'dotenv/config';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL 연결 성공');
    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL 연결 실패:', err.message);
  }
}

testConnection();

export default pool;