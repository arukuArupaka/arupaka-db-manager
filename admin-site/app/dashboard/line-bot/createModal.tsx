"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ARUPAKA_DB_MANAGER_URL } from "@/env";

export default function CreateModal({
  isOpenModal,
  setIsOpenModal,
  fetchSchedules,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchSchedules: (method?: string) => Promise<void>;
}) {
  // フォーム入力状態
  const [weekday, setWeekday] = useState<number>();
  const [hour, setHour] = useState<number>();
  const [minute, setMinute] = useState<number>();
  const [description, setDescription] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // API 呼び出し: 作成処理
  const createSchedules = async (
    weekday: number,
    hour: number,
    minute: number,
    description: string,
    message: string
  ): Promise<void> => {
    const response = await fetch(
      `${ARUPAKA_DB_MANAGER_URL}/line-bot/create-schedule`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          weekday,
          hour,
          minute,
          description,
          message,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP Error ${response.status}: ${errorText} ${weekday} ${hour} ${minute} ${description} ${message}`
      );
    }

    await fetchSchedules("create");
  };

  // モーダル内部の参照
  const modalRef = useRef<HTMLDivElement | null>(null);

  // モーダル外クリック検知で閉じる処理
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpenModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpenModal]);

  // モーダル表示中に背面のスクロールを禁止
  useEffect(() => {
    if (isOpenModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpenModal]);

  // フォーム送信時の処理
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      // 入力値でAPI呼び出し
      console.log("データ", weekday, hour, minute, description, message);
      await createSchedules(
        weekday as number,
        hour as number,
        minute as number,
        description,
        message
      );
      console.log("作成されたスケジュールデータ:", {
        weekday,
        hour,
        minute,
        description,
        message,
      });
      // フォーム送信後、モーダルを閉じる
      setIsOpenModal(false);
      // フォーム状態をリセットする
      setWeekday(undefined);
      setHour(undefined);
      setMinute(undefined);
      setDescription("");
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpenModal) return null;

  // 画面全体に固定するため fixed を利用
  return (
    <div className="fixed z-10 top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
      <div
        ref={modalRef}
        className="relative z-20 bg-slate-100 rounded-xl shadow-lg p-6 w-[90vw] max-w-md overflow-auto"
      >
        <h2 className="text-2xl font-bold mb-4">スケジュール作成</h2>
        <form onSubmit={handleSubmit}>
          {/* 曜日の選択 */}
          <div className="mb-4">
            <label htmlFor="weekday" className="block mb-1">
              曜日
            </label>
            <select
              id="weekday"
              value={weekday}
              onChange={(e) => setWeekday(Number(e.target.value))}
              className="w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">選択してください</option>
              <option value="0">日曜日</option>
              <option value="1">月曜日</option>
              <option value="2">火曜日</option>
              <option value="3">水曜日</option>
              <option value="4">木曜日</option>
              <option value="5">金曜日</option>
              <option value="6">土曜日</option>
            </select>
          </div>

          {/* 時間 */}
          <div className="mb-4">
            <label htmlFor="hour" className="block mb-1">
              時間 (0-23)
            </label>
            <Input
              id="hour"
              type="number"
              min="0"
              max="23"
              placeholder="例: 14"
              value={hour ?? ""}
              onChange={(e) => setHour(Number(e.target.value))}
              required
            />
          </div>

          {/* 分 */}
          <div className="mb-4">
            <label htmlFor="minute" className="block mb-1">
              分 (0-59)
            </label>
            <Input
              id="minute"
              type="number"
              min="0"
              max="59"
              placeholder="例: 30"
              value={minute ?? ""}
              onChange={(e) => setMinute(Number(e.target.value))}
              required
            />
          </div>

          {/* 説明 */}
          <div className="mb-4">
            <label htmlFor="description" className="block mb-1">
              説明
            </label>
            <Input
              id="description"
              type="text"
              placeholder="スケジュールの説明"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* メッセージ */}
          <div className="mb-4">
            <label htmlFor="message" className="block mb-1">
              メッセージ
            </label>
            <Input
              id="message"
              type="text"
              placeholder="表示するメッセージ"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          {/* ボタン群 */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpenModal(false)}
            >
              キャンセル
            </Button>
            <Button type="submit">作成</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
