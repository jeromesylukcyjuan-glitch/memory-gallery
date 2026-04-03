import { useState } from "react";
import { Memory } from "../../../drizzle/schema";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Play } from "lucide-react";

interface MemoryGridProps {
  memories: Memory[];
  onUploadSuccess?: () => void;
}

export default function MemoryGrid({ memories }: MemoryGridProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  // 按日期分组回忆
  const groupedMemories = memories.reduce(
    (acc, memory) => {
      const date = new Date(memory.memoryDate);
      const dateKey = date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(memory);
      return acc;
    },
    {} as Record<string, Memory[]>
  );

  return (
    <>
      {/* 时间轴视图 */}
      <div className="space-y-12">
        {Object.entries(groupedMemories).map(([dateKey, dateMemories]) => (
          <div key={dateKey}>
            {/* 日期标签 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="sketch-dashed px-4 py-2 bg-white/70 backdrop-blur">
                <h3
                  className="font-bold text-lg text-amber-900"
                  style={{ fontFamily: "var(--font-script)" }}
                >
                  {dateKey}
                </h3>
              </div>
              <div className="flex-1 h-0.5 border-t-2 border-dashed border-amber-300"></div>
            </div>

            {/* 网格展示 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(dateMemories as Memory[]).map((memory: Memory) => (
                <div
                  key={memory.id}
                  onClick={() => setSelectedMemory(memory)}
                  className="sketch-border group cursor-pointer overflow-hidden bg-white/70 backdrop-blur hover:shadow-lg transition-all duration-200"
                >
                  {/* 图片/视频缩略图 */}
                  <div className="relative w-full aspect-square bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
                    {memory.fileType === "image" ? (
                      <img
                        src={memory.fileUrl}
                        alt={memory.title || "Memory"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                    ) : (
                      <>
                        <video
                          src={memory.fileUrl}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
                          <Play className="w-12 h-12 text-white fill-white" />
                        </div>
                      </>
                    )}
                  </div>

                  {/* 标题和描述 */}
                  <div className="p-3">
                    {memory.title && (
                      <h4 className="font-bold text-amber-900 text-sm truncate">
                        {memory.title}
                      </h4>
                    )}
                    {memory.description && (
                      <p className="text-amber-800 text-xs line-clamp-2 mt-1">
                        {memory.description}
                      </p>
                    )}
                    {memory.aiGenerated === "pending" && (
                      <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></div>
                        AI 处理中...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 详情模态框 */}
      <Dialog open={!!selectedMemory} onOpenChange={() => setSelectedMemory(null)}>
        <DialogContent className="max-w-4xl bg-white/95 backdrop-blur border-2 border-amber-200">
          {selectedMemory && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 媒体展示 */}
              <div className="md:col-span-2">
                {selectedMemory.fileType === "image" ? (
                  <img
                    src={selectedMemory.fileUrl}
                    alt={selectedMemory.title || "Memory"}
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <video
                    src={selectedMemory.fileUrl}
                    controls
                    className="w-full h-auto rounded-lg"
                  />
                )}
              </div>

              {/* 详情信息 */}
              <div className="space-y-4">
                <div>
                  <h2
                    className="text-2xl font-bold text-amber-900"
                    style={{ fontFamily: "var(--font-script)" }}
                  >
                    {selectedMemory.title || "未命名回忆"}
                  </h2>
                </div>

                {selectedMemory.description && (
                  <div>
                    <h4 className="font-bold text-amber-900 mb-2">描述</h4>
                    <p className="text-amber-800 text-sm">{selectedMemory.description}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-amber-900 mb-2">日期</h4>
                  <p className="text-amber-800 text-sm">
                    {new Date(selectedMemory.memoryDate).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-amber-900 mb-2">类型</h4>
                  <p className="text-amber-800 text-sm">
                    {selectedMemory.fileType === "image" ? "📷 图片" : "🎥 视频"}
                  </p>
                </div>

                {selectedMemory.aiGenerated === "completed" && (
                  <div className="sketch-border p-3 bg-amber-50/50">
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <span className="text-lg">✨</span>
                      AI 已自动标注
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
