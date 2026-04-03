import mysql from 'mysql2/promise';

// 获取数据库连接信息
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// 解析DATABASE_URL
// 格式: mysql://user:password@host:port/database?ssl=...
const urlMatch = DATABASE_URL.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);

if (!urlMatch) {
  console.error('Invalid DATABASE_URL format');
  process.exit(1);
}

const [, user, password, host, port, database] = urlMatch;

console.log(`Connecting to database at ${host}:${port}/${database}...`);

// TiDB Cloud requires SSL connection
const config = {
  host,
  port: parseInt(port),
  user,
  password,
  database,
  ssl: {
    rejectUnauthorized: false,
  },
};

async function updateMemoryDates() {
  const connection = await mysql.createConnection(config);

  try {
    // 更新所有memories的memoryDate为2022年12月22日
    const targetDate = new Date('2022-12-22T00:00:00Z');
    
    console.log(`Target date: ${targetDate.toISOString()}`);
    const [result] = await connection.execute(
      'UPDATE memories SET memoryDate = ? WHERE memoryDate IS NOT NULL',
      [targetDate]
    );

    console.log(`✅ Successfully updated ${result.affectedRows} memory records to 2022-12-22`);
    console.log('Date format: 2022-12-22T00:00:00Z');
  } catch (error) {
    console.error('❌ Error updating memory dates:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

updateMemoryDates();
