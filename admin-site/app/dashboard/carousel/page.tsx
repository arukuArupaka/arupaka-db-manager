import { DataTable } from "@/components/dashboard/data-table";
import { columns } from "@/components/dashboard/carousel/columns";
import { carouselItems } from "@/components/dashboard/carousel/data";

export default function CarouselPage() {
  return (
    <div className="relative h-full w-full p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Carousel Editor</h1>
        <p className="text-muted-foreground">
          Manage and edit carousel items displayed in the app.
        </p>
      </div>
      <DataTable columns={columns} data={carouselItems} />
    </div>
  );
}
