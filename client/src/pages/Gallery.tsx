import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { skipToken } from "@tanstack/react-query";
import { Link } from "wouter";
import { Upload, Search, LogOut } from "lucide-react";
import MemoryGrid from "@/components/MemoryGrid";
import UploadModal from "@/components/UploadModal";

export default function Gallery() {
  const { user, logout } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<{ start: Date; end: Date } | null>(null);

  // 获取回忆列表
  const { data: memories, isLoading, refetch } = trpc.memories.list.useQuery({
    limit: 50,
    offset: 0,
  });

  // 搜索回忆
  const { data: searchResults } = trpc.memories.search.useQuery(searchQuery, {
    enabled: searchQuery.length > 0,
  });

  // 按日期范围筛选
  const { data: dateFilteredMemories } = trpc.memories.getByDateRange.useQuery(
    dateFilter ? { startDate: dateFilter.start, endDate: dateFilter.end } : skipToken
  );

  const displayMemories = searchQuery.length > 0 ? searchResults : dateFilter ? dateFilteredMemories || [] : memories || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur border-b-2 border-amber-200 sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <h1 className="text-3xl font-bold text-amber-900 cursor-pointer" style={{ fontFamily: "var(--font-script)" }}>
              Memory Gallery
            </h1>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/albums">
              <Button variant="ghost" className="text-amber-900 hover:bg-amber-100">
                相册
              </Button>
            </Link>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-amber-700 hover:bg-amber-800 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              上传
            </Button>
            <Button
              variant="ghost"
              onClick={() => logout()}
              className="text-amber-900 hover:bg-amber-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              退出
            </Button>
          </div>
        </div>
      </nav>

      {/* 搜索和筛选栏 */}
      <div className="bg-white/60 backdrop-blur border-b border-amber-200 sticky top-16 z-40">
        <div className="container py-4">
          <div className="flex gap-4 flex-wrap items-center">
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-amber-600" />
              <Input
                placeholder="搜索回忆..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-amber-200 focus:border-amber-400"
              />
            </div>
            <Input
              type="date"
              onChange={(e) => {
                if (e.target.value) {
                  const date = new Date(e.target.value);
                  setDateFilter({
                    start: date,
                    end: new Date(date.getTime() + 24 * 60 * 60 * 1000),
                  });
                } else {
                  setDateFilter(null);
                }
              }}
              className="border-amber-200 focus:border-amber-400"
            />
            {(searchQuery || dateFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setDateFilter(null);
                }}
                className="border-amber-200 text-amber-900 hover:bg-amber-100"
              >
                清除筛选
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="container py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-700"></div>
          </div>
        ) : displayMemories && displayMemories.length > 0 ? (
          <MemoryGrid memories={displayMemories} onUploadSuccess={() => refetch()} />
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-amber-900 mb-4" style={{ fontFamily: "var(--font-script)" }}>
              还没有回忆呢
            </h3>
            <p className="text-amber-800 mb-8">开始上传你的第一张照片或视频吧！</p>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-6"
            >
              <Upload className="w-5 h-5 mr-2" />
              上传第一个回忆
            </Button>
          </div>
        )}
      </div>

      {/* 上传模态框 */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={() => {
          setShowUploadModal(false);
          refetch();
        }}
      />
    </div>
  );
}
