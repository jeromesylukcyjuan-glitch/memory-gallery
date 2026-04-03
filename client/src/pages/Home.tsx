import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Upload, Grid3x3, Search, Sparkles } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl text-center space-y-8">
          {/* 标题 */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold text-amber-900" style={{ fontFamily: "var(--font-script)" }}>
              Memory Gallery
            </h1>
            <p className="text-xl md:text-2xl text-amber-800 font-medium">
              记录生活中的每一个珍贵时刻
            </p>
          </div>

          {/* 特性展示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
            <div className="sketch-border p-6 bg-white/70 backdrop-blur">
              <Upload className="w-8 h-8 text-amber-700 mb-3 mx-auto" />
              <h3 className="font-bold text-lg text-amber-900 mb-2">轻松上传</h3>
              <p className="text-amber-800 text-sm">支持拖拽和批量上传照片和视频</p>
            </div>

            <div className="sketch-border p-6 bg-white/70 backdrop-blur">
              <Grid3x3 className="w-8 h-8 text-amber-700 mb-3 mx-auto" />
              <h3 className="font-bold text-lg text-amber-900 mb-2">智能分类</h3>
              <p className="text-amber-800 text-sm">创建相册，按时间轴展示回忆</p>
            </div>

            <div className="sketch-border p-6 bg-white/70 backdrop-blur">
              <Search className="w-8 h-8 text-amber-700 mb-3 mx-auto" />
              <h3 className="font-bold text-lg text-amber-900 mb-2">快速搜索</h3>
              <p className="text-amber-800 text-sm">按日期、相册或关键词查找回忆</p>
            </div>

            <div className="sketch-border p-6 bg-white/70 backdrop-blur">
              <Sparkles className="w-8 h-8 text-amber-700 mb-3 mx-auto" />
              <h3 className="font-bold text-lg text-amber-900 mb-2">AI 标注</h3>
              <p className="text-amber-800 text-sm">自动生成描述和标签</p>
            </div>
          </div>

          {/* 登录按钮 */}
          <div className="pt-8">
            <Button
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
              className="px-8 py-6 text-lg font-bold rounded-lg"
              style={{
                backgroundColor: "oklch(0.28 0.025 65)",
                color: "oklch(0.97 0.01 70)",
              }}
            >
              开始记录回忆
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur border-b-2 border-amber-200 sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <Link href="/gallery">
            <h1 className="text-3xl font-bold text-amber-900 cursor-pointer" style={{ fontFamily: "var(--font-script)" }}>
              Memory Gallery
            </h1>
          </Link>
          <div className="flex gap-4">
            <Link href="/gallery">
              <Button variant="ghost" className="text-amber-900 hover:bg-amber-100">
                我的回忆
              </Button>
            </Link>
            <Link href="/albums">
              <Button variant="ghost" className="text-amber-900 hover:bg-amber-100">
                相册
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="text-amber-900 hover:bg-amber-100">
                个人资料
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 欢迎信息 */}
      <div className="container py-12">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-amber-900" style={{ fontFamily: "var(--font-script)" }}>
            欢迎回来，{user?.name}！
          </h2>
          <p className="text-lg text-amber-800">
            开始探索你的回忆或创建新的相册
          </p>
        </div>

        {/* 快速操作 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/upload">
            <div className="sketch-border p-8 bg-white/70 backdrop-blur hover:shadow-lg transition cursor-pointer">
              <Upload className="w-12 h-12 text-amber-700 mb-4 mx-auto" />
              <h3 className="font-bold text-xl text-amber-900 mb-2">上传新回忆</h3>
              <p className="text-amber-800 text-sm">添加照片或视频到你的相册</p>
            </div>
          </Link>

          <Link href="/gallery">
            <div className="sketch-border p-8 bg-white/70 backdrop-blur hover:shadow-lg transition cursor-pointer">
              <Grid3x3 className="w-12 h-12 text-amber-700 mb-4 mx-auto" />
              <h3 className="font-bold text-xl text-amber-900 mb-2">浏览回忆</h3>
              <p className="text-amber-800 text-sm">查看时间轴上的所有回忆</p>
            </div>
          </Link>

          <Link href="/albums">
            <div className="sketch-border p-8 bg-white/70 backdrop-blur hover:shadow-lg transition cursor-pointer">
              <Search className="w-12 h-12 text-amber-700 mb-4 mx-auto" />
              <h3 className="font-bold text-xl text-amber-900 mb-2">管理相册</h3>
              <p className="text-amber-800 text-sm">组织和编辑你的相册</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
