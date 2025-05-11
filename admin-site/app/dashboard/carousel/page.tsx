"use client";

import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Carousel } from "@/components/interface/Carousel";
import CarouselList from "@/components/dashboard/carousel/CarouselList";
import CarouselForm from "@/components/dashboard/carousel/CarouselForm";

const fetchCarouselItems = async (): Promise<Carousel[]> => {
  const response = await fetch("/api/carousel/get-carousel", {
    method: "GET",
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error("errordata", errorData);
    throw new Error("fetchCarouselFailed:" + errorData.message);
  }
  const data: Carousel[] = await response.json();
  return data;
};

const postCarouselItem = async (formData: FormData) => {
  const response = await fetch("/api/carousel/post-carousel", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error("error data:", errorData);
    throw new Error("postCarouselFailed:" + errorData.message);
  }
  return response.json();
};

const deleteCarouselItem = async (id: number) => {
  const response = await fetch(`/api/carousel/delete-carousel`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error("error data:", errorData);
    throw new Error("deleteCarouselFailed:" + errorData.message);
  }
  return response.json();
};

export default function CarouselPage() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [carouselUrl, setCarouselUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [carouselItems, setCarouselItems] = useState<Carousel[]>([]);

  const fetchAndSet = async () => {
    try {
      const items = await fetchCarouselItems();
      setCarouselItems(items);
    } catch (error) {
      console.error(error);
      toast({
        title: "エラー",
        description: "カルーセルアイテムの取得に失敗しました" + error,
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (!imageFile) {
        toast({
          title: "エラー",
          description: "画像を選択してください",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("title", title || "");
      formData.append("description", description || "");
      formData.append("carouselUrl", carouselUrl || "");
      formData.append("image", imageFile);

      await postCarouselItem(formData);

      toast({
        title: "成功",
        description: "カルーセルアイテムが追加されました",
      });

      setTitle("");
      setDescription("");
      setCarouselUrl("");
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "エラー",
        description: "カルーセルアイテムの追加に失敗しました" + error,
        variant: "destructive",
      });
    } finally {
      await fetchAndSet();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("このカルーセルアイテムを削除してもよろしいですか？")) {
      try {
        await deleteCarouselItem(id);

        toast({
          title: "削除完了",
          description: "カルーセルアイテムが削除されました",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "エラー",
          description: "カルーセルアイテムの削除に失敗しました" + error,
          variant: "destructive",
        });
      } finally {
        await fetchAndSet();
      }
    }
  };

  useEffect(() => {
    fetchAndSet();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">カルーセル管理</h1>
        <p className="text-muted-foreground">カルーセルアイテムを追加・編集します。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CarouselForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          carouselUrl={carouselUrl}
          setCarouselUrl={setCarouselUrl}
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          handleSubmit={handleSubmit}
        />
        <CarouselList carouselItems={carouselItems} onDelete={handleDelete} />
      </div>
    </div>
  );
}
