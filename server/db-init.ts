import { getDb } from "./db";

/**
 * 初始化数据库表
 * 在应用启动时调用此函数来创建所需的表
 */
export async function initializeDatabase() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot initialize: database not available");
    return;
  }

  try {
    console.log("[Database] Initializing tables...");

    // 创建相册表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS \`albums\` (
        \`id\` int AUTO_INCREMENT NOT NULL,
        \`userId\` int NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`description\` text,
        \`coverImageUrl\` text,
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_userId\` (\`userId\`)
      )
    `);
    console.log("[Database] Created albums table");

    // 创建回忆表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS \`memories\` (
        \`id\` int AUTO_INCREMENT NOT NULL,
        \`userId\` int NOT NULL,
        \`albumId\` int,
        \`title\` varchar(255),
        \`description\` text,
        \`fileUrl\` text NOT NULL,
        \`fileKey\` text NOT NULL,
        \`fileType\` varchar(50) NOT NULL,
        \`mimeType\` varchar(100),
        \`memoryDate\` timestamp NOT NULL,
        \`aiGenerated\` enum('pending','completed','failed') DEFAULT 'pending',
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_userId\` (\`userId\`),
        INDEX \`idx_albumId\` (\`albumId\`),
        INDEX \`idx_memoryDate\` (\`memoryDate\`)
      )
    `);
    console.log("[Database] Created memories table");

    // 创建标签表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS \`tags\` (
        \`id\` int AUTO_INCREMENT NOT NULL,
        \`memoryId\` int NOT NULL,
        \`tag\` varchar(100) NOT NULL,
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_memoryId\` (\`memoryId\`),
        INDEX \`idx_tag\` (\`tag\`)
      )
    `);
    console.log("[Database] Created tags table");

    console.log("[Database] Database initialization completed successfully");
  } catch (error) {
    console.error("[Database] Failed to initialize database:", error);
    // 不抛出错误，允许应用继续运行
  }
}
