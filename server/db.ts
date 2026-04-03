import { eq, desc, and, or, like, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, albums, memories, tags, InsertAlbum, InsertMemory } from "../drizzle/schema";
import { ENV } from './_core/env';

// Alias for tags table to avoid naming conflict
const tags_table = tags;

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Album queries
export async function createAlbum(userId: number, name: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(albums).values({
    userId,
    name,
    description,
  });
  return result;
}

export async function getUserAlbums(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(albums).where(eq(albums.userId, userId));
}

export async function updateAlbum(albumId: number, updates: Partial<InsertAlbum>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(albums).set(updates).where(eq(albums.id, albumId));
}

export async function deleteAlbum(albumId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(albums).where(eq(albums.id, albumId));
}

// Memory queries
export async function createMemory(userId: number, data: Omit<InsertMemory, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(memories).values({
    ...data,
    userId,
  });
}

export async function getUserMemories(userId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db
    .select()
    .from(memories)
    .where(eq(memories.userId, userId))
    .orderBy(desc(memories.memoryDate))
    .limit(limit)
    .offset(offset);
}

export async function getAlbumMemories(albumId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db
    .select()
    .from(memories)
    .where(eq(memories.albumId, albumId))
    .orderBy(desc(memories.memoryDate));
}

export async function updateMemory(memoryId: number, updates: Partial<InsertMemory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(memories).set(updates).where(eq(memories.id, memoryId));
}

export async function deleteMemory(memoryId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(memories).where(eq(memories.id, memoryId));
}

// Tag queries
export async function addTags(memoryId: number, tags: string[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(tags_table).values(
    tags.map(tag => ({
      memoryId,
      tag,
    }))
  );
}

export async function getMemoryTags(memoryId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(tags_table).where(eq(tags_table.memoryId, memoryId));
}

export async function deleteMemoryTags(memoryId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(tags_table).where(eq(tags_table.memoryId, memoryId));
}

// Search queries
export async function searchMemories(userId: number, query: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db
    .select()
    .from(memories)
    .where(
      and(
        eq(memories.userId, userId),
        or(
          like(memories.title, `%${query}%`),
          like(memories.description, `%${query}%`)
        )
      )
    )
    .orderBy(desc(memories.memoryDate));
}

export async function getMemoriesByDateRange(userId: number, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db
    .select()
    .from(memories)
    .where(
      and(
        eq(memories.userId, userId),
        gte(memories.memoryDate, startDate),
        lte(memories.memoryDate, endDate)
      )
    )
    .orderBy(desc(memories.memoryDate));
}
