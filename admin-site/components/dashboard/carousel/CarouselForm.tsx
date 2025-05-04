import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// filepath: c:\arupaka\arupaka-db-manager\admin-site\app\dashboard\carousel\components\CarouselForm.tsx
const CarouselForm = ({
  title,
  setTitle,
  description,
  setDescription,
  carouselUrl,
  setCarouselUrl,
  imagePreview,
  handleImageChange,
  handleSubmit,
}: {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  carouselUrl: string;
  setCarouselUrl: React.Dispatch<React.SetStateAction<string>>;
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}) => (
  <div className="bg-white p-6 rounded-lg border shadow-sm">
    <h2 className="text-xl font-semibold mb-4">新規アイテム追加</h2>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* タイトル */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          タイトル (オプション)
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルを入力してください"
        />
      </div>

      {/* 説明 */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          説明 (オプション)
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="説明を入力してください"
          className="h-24"
        />
      </div>

      {/* URL */}
      <div className="space-y-2">
        <label htmlFor="carouselUrl" className="text-sm font-medium">
          URL (オプション)
        </label>
        <Input
          id="carouselUrl"
          value={carouselUrl}
          onChange={(e) => setCarouselUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      {/* 画像 */}
      <div className="space-y-2">
        <label htmlFor="image" className="text-sm font-medium">
          画像
        </label>
        <div className="flex flex-col space-y-4">
          <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-2">プレビュー:</p>
              <div className="relative w-64 h-40 border rounded-md overflow-hidden">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="プレビュー"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Button type="submit">カルーセルアイテムを追加</Button>
    </form>
  </div>
);

export default CarouselForm;
