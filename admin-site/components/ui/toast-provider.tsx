"use client";

import React from "react";
import { Toast } from "@/components/ui/toast"; // トースト通知の UI コンポーネント
import { useToast } from "@/hooks/use-toast"; // useToast フックをインポート

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts } = useToast(); // トーストの状態を取得

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </>
  );
}
