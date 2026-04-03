import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LogOut } from "lucide-react";
import UploadModal from "@/components/UploadModal";
import { useState } from "react";

export default function UploadPage() {
  const { user, logout } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(true);

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

      {/* 上传模态框 */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          // 返回到Gallery页面
          window.location.href = "/gallery";
        }}
        onUploadSuccess={() => {
          setShowUploadModal(false);
          window.location.href = "/gallery";
        }}
      />
    </div>
  );
}
