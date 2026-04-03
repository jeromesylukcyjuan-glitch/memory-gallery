// Preconfigured storage helpers for Manus WebDev templates
// Uses the Biz-provided storage proxy (Authorization: Bearer <token>)

import { ENV } from './_core/env';

type StorageConfig = { baseUrl: string; apiKey: string };

function getStorageConfig(): StorageConfig {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }

  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}

function buildUploadUrl(baseUrl: string, relKey: string): URL {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}

async function buildDownloadUrl(
  baseUrl: string,
  relKey: string,
  apiKey: string
): Promise<string> {
  const downloadApiUrl = new URL(
    "v1/storage/downloadUrl",
    ensureTrailingSlash(baseUrl)
  );
  downloadApiUrl.searchParams.set("path", normalizeKey(relKey));
  const response = await fetch(downloadApiUrl, {
    method: "GET",
    headers: buildAuthHeaders(apiKey),
  });
  return (await response.json()).url;
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function toFormData(
  data: Buffer | Uint8Array | string,
  contentType: string,
  fileName: string
): FormData {
  const blob =
    typeof data === "string"
      ? new Blob([data], { type: contentType })
      : new Blob([data as any], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}

function buildAuthHeaders(apiKey: string): HeadersInit {
  return { Authorization: `Bearer ${apiKey}` };
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string; }> {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  return {
    key,
    url: await buildDownloadUrl(baseUrl, key, apiKey),
  };
}


import { nanoid } from "nanoid";

/**
 * 上传回忆文件到S3
 * @param file 文件数据（Buffer或Uint8Array）
 * @param fileName 原始文件名
 * @param mimeType 文件MIME类型
 * @returns 返回上传后的URL和fileKey
 */
export async function uploadMemoryFile(
  file: Buffer | Uint8Array,
  fileName: string,
  mimeType: string
) {
  try {
    // 生成唯一的文件key，避免枚举
    const randomSuffix = nanoid(8);
    const fileExtension = fileName.split(".").pop() || "bin";
    const fileKey = `memories/${Date.now()}-${randomSuffix}.${fileExtension}`;

    // 上传到S3
    const { url } = await storagePut(fileKey, file, mimeType);

    return {
      url,
      fileKey,
      success: true,
    };
  } catch (error) {
    console.error("Failed to upload memory file:", error);
    throw new Error("文件上传失败");
  }
}

/**
 * 获取文件的预签名URL
 * @param fileKey S3文件key
 * @returns 预签名URL
 */
export async function getMemoryFileUrl(fileKey: string) {
  try {
    const { url } = await storageGet(fileKey);
    return url;
  } catch (error) {
    console.error("Failed to get memory file URL:", error);
    throw new Error("获取文件URL失败");
  }
}
