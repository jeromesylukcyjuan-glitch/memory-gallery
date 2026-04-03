import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
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

    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/")
      );
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("请选择至少一个文件");
      return;
    }

    setIsUploading(true);

    try {
      for (const file of files) {
        // 上传文件到S3
        const formData = new FormData();
        formData.append("file", file);

        // 这里需要实现文件上传到S3的逻辑
        // 暂时使用模拟的URL
        const fileUrl = URL.createObjectURL(file);
        const fileKey = `memories/${Date.now()}-${file.name}`;

        const fileType = file.type.startsWith("image/") ? "image" : "video";

        // 创建回忆记录
        const result = await createMemoryMutation.mutateAsync({
          fileUrl,
          fileKey,
          fileType,
          mimeType: file.type,
          title: title || file.name,
          description,
          memoryDate: new Date(memoryDate),
        });

        // 触发AI标注（异步执行）
        if (result && typeof result === "object" && "id" in result) {
          generateAIMutation.mutate({
            memoryId: (result as any).id,
            fileUrl,
            fileType,
          });
        }
      }

      toast.success("回忆上传成功！");
      setFiles([]);
      setTitle("");
      setDescription("");
      setMemoryDate(new Date().toISOString().split("T")[0]);
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("上传失败，请重试");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur border-2 border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-900" style={{ fontFamily: "var(--font-script)" }}>
            上传新回忆
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 拖拽上传区域 */}
          <div
            ref={dragRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="sketch-dashed border-2 border-dashed border-amber-300 rounded-lg p-8 text-center cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="w-12 h-12 text-amber-700 mx-auto mb-4" />
            <h3 className="font-bold text-lg text-amber-900 mb-2">
              拖拽文件到这里或点击选择
            </h3>
            <p className="text-amber-800 text-sm">
              支持图片和视频，单个文件最大 100MB
            </p>
          </div>

          {/* 已选择的文件列表 */}
          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-amber-900">已选择的文件 ({files.length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="sketch-border p-3 bg-white/70 flex items-center justify-between"
                  >
                    <span className="text-amber-900 text-sm truncate">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-amber-600 hover:text-amber-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 回忆信息表单 */}
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-amber-900 mb-2">标题（可选）</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="给这个回忆起个名字..."
                className="border-amber-200 focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-bold text-amber-900 mb-2">描述（可选）</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="记录一些关于这个回忆的细节..."
                className="w-full p-2 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block font-bold text-amber-900 mb-2">回忆日期</label>
              <Input
                type="date"
                value={memoryDate}
                onChange={(e) => setMemoryDate(e.target.value)}
                className="border-amber-200 focus:border-amber-400"
              />
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-amber-200 text-amber-900 hover:bg-amber-100"
            >
              取消
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || isUploading}
              className="bg-amber-700 hover:bg-amber-800 text-white disabled:opacity-50"
            >
              {isUploading ? "上传中..." : "上传回忆"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
