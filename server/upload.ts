import { Router, Response } from "express";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import multer from "multer";
import type { Request } from "express";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/upload
 * 上传文件到S3
 * 期望的multipart字段：
 * - file: 文件内容
 * - filename: 原始文件名
 */
router.post("/upload", upload.single("file"), async (req: any, res: Response) => {
  try {
    const file = req.file as any;
    if (!file) {
      return res.status(400).json({ error: "没有文件被上传" });
    }

    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ error: "缺少文件名" });
    }

    // 验证文件大小（最大500MB）
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return res.status(413).json({ error: "文件过大，最大500MB" });
    }

    // 生成唯一的文件key
    const randomSuffix = nanoid(8);
    const fileExtension = filename.split(".").pop() || "bin";
    const fileKey = `memories/${Date.now()}-${randomSuffix}.${fileExtension}`;

    // 上传到S3
    const { url } = await storagePut(
      fileKey,
      file.buffer,
      file.mimetype
    );

    return res.json({
      success: true,
      url,
      fileKey,
      filename,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      error: "文件上传失败",
      message: error instanceof Error ? error.message : "未知错误",
    });
  }
});

export default router;
