import { Carousel } from "@/components/interface/Carousel";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CarouselList = ({
  carouselItems,
  onDelete,
}: {
  carouselItems: Carousel[];
  onDelete: (id: number) => void;
}) => (
  <div className="bg-white p-6 rounded-lg border shadow-sm">
    <h2 className="text-xl font-semibold mb-4">カルーセル一覧</h2>
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {carouselItems.length > 0 ? (
        carouselItems.map((item) => (
          <div key={item.id} className="border rounded-md p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-1 block"
                  >
                    {item.url}
                  </a>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
            <div className="relative w-full border rounded-md overflow-hidden">
              <img
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="text-xs text-muted-foreground">ID: {item.id}</div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">カルーセルアイテムがありません</div>
      )}
    </div>
  </div>
);

export default CarouselList;
