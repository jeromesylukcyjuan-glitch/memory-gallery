import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Upload, X, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

interface FileUploadItem {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [memoryDate, setMemoryDate] = useState(new Date().toISOString().split("T")[0]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const createMemoryMutation = trpc.memories.create.useMutation();
  const generateAIMutation = trpc.memories.generateAIDescription.useMutation();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragRef.current) {
      dragRef.current.classList.add("border-amber-500", "bg-amber-50");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragRef.current) {
      dragRef.current.classList.remove("border-amber-500", "bg-amber-50");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragRef.current) {
      dragRef.current.classList.remove("border-amber-500", "bg-amber-50");
    }

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (droppedFiles.length > 0) {
      const newFiles: FileUploadItem[] = droppedFiles.map((file) => ({
        file,
        progress: 0,
        status: "pending",
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const newFiles: FileUploadItem[] = selectedFiles.map((file) => ({
        file,
        progress: 0,
        status: "pending",
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (fileItem: FileUploadItem): Promise<{ url: string; fileKey: string } | null> => {
    const formData = new FormData();
    formData.append("file", fileItem.file);
    formData.append("filename", fileItem.file.name);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "上传失败");
      }

      const data = await response.json();
      return { url: data.url, fileKey: data.fileKey };
    } catch (error) {
      throw error;
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("请选择至少一个文件");
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const fileItem = files[i];
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "uploading" } : f
          )
        );

        try {
          // 上传文件到S3
          const uploadResult = await uploadFile(fileItem);
          if (!uploadResult) {
            throw new Error("上传返回无效结果");
          }

          const fileType = fileItem.file.type.startsWith("image/") ? "image" : "video";

          // 创建回忆记录
          const result = await createMemoryMutation.mutateAsync({
            fileUrl: uploadResult.url,
            fileKey: uploadResult.fileKey,
            fileType,
            mimeType: fileItem.file.type,
            title: title || fileItem.file.name,
            description,
            memoryDate: new Date(memoryDate),
          });

          // 触发AI标注（异步执行）
          if (result && typeof result === "object" && "id" in result) {
            generateAIMutation.mutate({
              memoryId: (result as any).id,
              fileUrl: uploadResult.url,
              fileType,
            });
          }

          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i ? { ...f, status: "success", progress: 100 } : f
            )
          );
          successCount++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "上传失败";
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i ? { ...f, status: "error", error: errorMessage } : f
            )
          );
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`成功上传 ${successCount} 个文件`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} 个文件上传失败`);
      }

      if (successCount > 0) {
        setTimeout(() => {
          setFiles([]);
          setTitle("");
          setDescription("");
          setMemoryDate(new Date().toISOString().split("T")[0]);
          onUploadSuccess();
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("上传过程出错");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur border-2 border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-2xl" style={{ fontFamily: "var(--font-script)" }}>
            上传新回忆
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 拖拽上传区域 */}
          <div
            ref={dragRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center cursor-pointer transition-colors"
          >
            <Upload className="w-12 h-12 mx-auto mb-2 text-amber-700" />
            <p className="text-amber-900 font-medium">拖拽文件到这里或点击选择</p>
            <p className="text-sm text-amber-700">支持图片和视频，单个文件最大500MB</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              className="mt-4 border-amber-700 text-amber-900 hover:bg-amber-50"
              onClick={() => fileInputRef.current?.click()}
            >
              选择文件
            </Button>
          </div>

          {/* 已选择的文件列表 */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {files.map((fileItem, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-amber-900 truncate">
                      {fileItem.file.name}
                    </p>
                    <p className="text-xs text-amber-700">
                      {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {fileItem.status === "uploading" && (
                      <div className="mt-1 w-full bg-amber-200 rounded-full h-1.5">
                        <div
                          className="bg-amber-700 h-1.5 rounded-full transition-all"
                          style={{ width: `${fileItem.progress}%` }}
                        />
                      </div>
                    )}
                    {fileItem.error && (
                      <p className="text-xs text-red-600 mt-1">{fileItem.error}</p>
                    )}
                  </div>

                  {fileItem.status === "success" && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                  {fileItem.status === "error" && (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  {fileItem.status !== "success" && fileItem.status !== "error" && (
                    <button
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                      className="text-amber-700 hover:text-amber-900 disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 元数据输入 */}
          <div className="space-y-3 border-t border-amber-200 pt-4">
            <div>
              <label className="text-sm font-medium text-amber-900">标题（可选）</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="给这个回忆起个名字..."
                className="mt-1 border-amber-200 focus:border-amber-500"
                disabled={isUploading}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-amber-900">描述（可选）</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="记录一些关于这个回忆的细节..."
                className="mt-1 w-full p-2 border border-amber-200 rounded-md focus:border-amber-500 focus:outline-none"
                rows={3}
                disabled={isUploading}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-amber-900">回忆日期</label>
              <Input
                type="date"
                value={memoryDate}
                onChange={(e) => setMemoryDate(e.target.value)}
                className="mt-1 border-amber-200 focus:border-amber-500"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 justify-end border-t border-amber-200 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
              className="border-amber-700 text-amber-900 hover:bg-amber-50"
            >
              取消
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || isUploading}
              className="bg-amber-700 hover:bg-amber-800 text-white"
            >
              {isUploading ? "上传中..." : "开始上传"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
