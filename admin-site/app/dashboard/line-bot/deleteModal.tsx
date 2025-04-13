import { ARUPAKA_DB_MANAGER_URL } from "@/env";
import React, { useEffect, useRef } from "react";

export default function DeleteModal({
  isOpenModal,
  setIsOpenModal,
  fetchSchedules,
  targetDeleteScheduleId,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchSchedules: (method?: string) => Promise<void>;
  targetDeleteScheduleId: string | null;
}) {
  // ---------------------------------------------
  // モーダル外をクリックした時の処理
  // ---------------------------------------------
  const modalRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !(modalRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsOpenModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setIsOpenModal]);

  // ---------------------------------------------
  // モーダル表示中: 背面のスクロールを禁止
  // ---------------------------------------------
  useEffect(() => {
    if (isOpenModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpenModal]);

  const deleteSchedules = async (id: string | null): Promise<void> => {
    const response = await fetch(
      `${ARUPAKA_DB_MANAGER_URL}/line-bot/delete-schedule`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          id,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText} ${id}`);
    }
  };

  if (!isOpenModal) return null;

  return (
    <div className="fixed z-10 top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
      <div
        ref={modalRef}
        className="relative z-20 bg-slate-100 rounded-xl shadow-lg p-6 w-[90vw] max-w-md overflow-auto"
      >
        <h2 className="text-2xl font-bold mb-4">スケジュール削除</h2>
        <p className="mb-4">
          本当にスケジュールを削除しますか？この操作は元に戻せません。
        </p>
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
            onClick={async () => {
              try {
                await deleteSchedules(targetDeleteScheduleId);
                console.log("スケジュールが削除されました");
              } catch (error) {
                console.error("削除処理中にエラーが発生しました:", error);
              } finally {
                await fetchSchedules("delete");
                setIsOpenModal(false);
              }
            }}
          >
            削除
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            onClick={() => {
              setIsOpenModal(false);
            }}
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
