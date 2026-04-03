import { describe, expect, it, beforeEach } from "vitest";
import {
  createMemory,
  getUserMemories,
  updateMemory,
  deleteMemory,
  addTags,
  getMemoryTags,
  createAlbum,
  getUserAlbums,
} from "./db";

// 测试数据
const testUserId = 999;
const testMemoryData = {
  fileUrl: "https://example.com/test.jpg",
  fileKey: "memories/test.jpg",
  fileType: "image" as const,
  mimeType: "image/jpeg",
  title: "Test Memory",
  description: "A test memory",
  memoryDate: new Date(),
};

describe("Memory Management", () => {
  describe("createMemory", () => {
    it("should create a memory record", async () => {
      const result = await createMemory(testUserId, testMemoryData);
      expect(result).toBeDefined();
    });
  });

  describe("getUserMemories", () => {
    it("should retrieve user memories", async () => {
      // 创建一个测试回忆
      await createMemory(testUserId, testMemoryData);

      // 获取用户的回忆
      const memories = await getUserMemories(testUserId, 10, 0);
      expect(Array.isArray(memories)).toBe(true);
      expect(memories.length).toBeGreaterThan(0);
    });
  });

  describe("updateMemory", () => {
    it("should update memory details", async () => {
      // 创建一个测试回忆
      const createResult = await createMemory(testUserId, testMemoryData);
      const memoryId = (createResult as any).insertId || 1;

      // 更新回忆
      const updateResult = await updateMemory(memoryId, {
        title: "Updated Title",
        description: "Updated description",
      });

      expect(updateResult).toBeDefined();
    });
  });

  describe("Tag Management", () => {
    it("should add tags to a memory", async () => {
      const createResult = await createMemory(testUserId, testMemoryData);
      const memoryId = (createResult as any).insertId || 1;

      const tags = ["vacation", "beach", "summer"];
      const result = await addTags(memoryId, tags);
      expect(result).toBeDefined();
    });

    it("should retrieve memory tags", async () => {
      const createResult = await createMemory(testUserId, testMemoryData);
      const memoryId = (createResult as any).insertId || 1;

      const tags = ["test", "demo"];
      await addTags(memoryId, tags);

      const retrievedTags = await getMemoryTags(memoryId);
      expect(Array.isArray(retrievedTags)).toBe(true);
    });
  });

  describe("Album Management", () => {
    it("should create an album", async () => {
      const result = await createAlbum(testUserId, "Test Album", "A test album");
      expect(result).toBeDefined();
    });

    it("should retrieve user albums", async () => {
      await createAlbum(testUserId, "Test Album", "A test album");

      const albums = await getUserAlbums(testUserId);
      expect(Array.isArray(albums)).toBe(true);
    });
  });
});
