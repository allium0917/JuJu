import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'myuser',
  host: 'localhost',
  database: 'science',
  password: '0917',
  port: 5432,
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