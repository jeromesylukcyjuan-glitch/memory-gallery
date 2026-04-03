import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Plus, Trash2, Edit2, LogOut } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Albums() {
  const { user, logout } = useAuth();
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 获取相册列表
  const { data: albums, isLoading, refetch } = trpc.albums.list.useQuery();

  // 创建相册
  const createAlbumMutation = trpc.albums.create.useMutation({
    onSuccess: () => {
      toast.success("相册创建成功！");
      setAlbumName("");
      setAlbumDescription("");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error("创建相册失败");
    },
  });

  // 删除相册
  const deleteAlbumMutation = trpc.albums.delete.useMutation({
    onSuccess: () => {
      toast.success("相册已删除");
      refetch();
    },
    onError: () => {
      toast.error("删除相册失败");
    },
  });

  const handleCreateAlbum = () => {
    if (!albumName.trim()) {
      toast.error("请输入相册名称");
      return;
    }

    createAlbumMutation.mutate({
      name: albumName,
      description: albumDescription,
    });
  };

  const handleDeleteAlbum = (albumId: number) => {
    if (confirm("确定要删除这个相册吗？")) {
      deleteAlbumMutation.mutate(albumId);
    }
  };

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

      {/* 主内容区 */}
      <div className="container py-8">
        {/* 页面标题和创建按钮 */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-amber-900" style={{ fontFamily: "var(--font-script)" }}>
            我的相册
          </h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-700 hover:bg-amber-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                创建相册
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur border-2 border-amber-200">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-amber-900" style={{ fontFamily: "var(--font-script)" }}>
                  创建新相册
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-amber-900 mb-2">相册名称</label>
                  <Input
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    placeholder="给相册起个名字..."
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-amber-900 mb-2">描述（可选）</label>
                  <textarea
                    value={albumDescription}
                    onChange={(e) => setAlbumDescription(e.target.value)}
                    placeholder="描述这个相册..."
                    className="w-full p-2 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-amber-200 text-amber-900 hover:bg-amber-100"
                  >
                    取消
                  </Button>
                  <Button
                    onClick={handleCreateAlbum}
                    disabled={createAlbumMutation.isPending}
                    className="bg-amber-700 hover:bg-amber-800 text-white disabled:opacity-50"
                  >
                    {createAlbumMutation.isPending ? "创建中..." : "创建"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 相册列表 */}
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-700"></div>
          </div>
        ) : albums && albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album.id}
                className="sketch-border bg-white/70 backdrop-blur overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* 相册封面 */}
                <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  {album.coverImageUrl ? (
                    <img
                      src={album.coverImageUrl}
                      alt={album.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl">📷</div>
                  )}
                </div>

                {/* 相册信息 */}
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-xl text-amber-900 truncate">
                    {album.name}
                  </h3>
                  {album.description && (
                    <p className="text-amber-800 text-sm line-clamp-2">
                      {album.description}
                    </p>
                  )}

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <Link href={`/albums/${album.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-amber-200 text-amber-900 hover:bg-amber-100"
                      >
                        查看
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-200 text-amber-900 hover:bg-amber-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAlbum(album.id)}
                      className="border-red-200 text-red-900 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-amber-900 mb-4" style={{ fontFamily: "var(--font-script)" }}>
              还没有相册呢
            </h3>
            <p className="text-amber-800 mb-8">创建你的第一个相册来组织回忆吧！</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              创建第一个相册
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
