"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSchedules } from "@/functions/line-bot/createSchedules";
import { set, useForm, useWatch } from "react-hook-form";

interface FormValues {
  date: string;
  weekday: number;
  hour: number;
  minute: number;
  description: string;
  message: string;
  category: string;
  resultSendWeekday: number;
  resultSendHour: number;
  resultSendMinute: number;
}

export default function CreateModal({
  from,
  isOpenModal,
  setIsOpenModal,
  fetchSchedules,
}: {
  from?: string;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchSchedules: (method?: string) => Promise<void>;
}) {
  // フォーム入力状態

  const { register, handleSubmit, control } = useForm<FormValues>();

  const category = useWatch({
    control,
    name: "category",
    defaultValue: "",
  });

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

  const onSubmit = async (data: FormValues) => {
    try {
      await createSchedules(
        Number(data.weekday),
        Number(data.hour),
        Number(data.minute),
        data.description,
        data.message,
        category,
        fetchSchedules,
        Number(data.resultSendWeekday),
        Number(data.resultSendHour),
        Number(data.resultSendMinute)
      );
      setIsOpenModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpenModal) return null;

  return (
    <div className="fixed z-10 top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
      <div
        ref={modalRef}
        className="relative z-20 bg-slate-100 rounded-xl shadow-lg p-6 w-[90vw] max-w-md overflow-auto"
      >
        <h2 className="text-2xl font-bold mb-4">スケジュール作成</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="weekday" className="block mb-1">
              曜日
            </label>
            <select
              id="weekday"
              {...register("weekday", { required: true })}
              className="w-full border border-gray-300 rounded p-2"
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
              {...register("hour", { required: false })}
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
              {...register("minute", { required: false })}
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
              {...register("description", { required: true })}
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
              {...register("message", { required: true })}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="weekday" className="block mb-1">
              カテゴリ
            </label>
            <select
              id="weekday"
              {...register("category", { required: true })}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="">選択してください</option>
              <option value="MESSAGE">メッセージのみ</option>
              <option value="FORM">アンケート作成</option>
            </select>
          </div>
          {category === "FORM" && (
            <div className="mb-4">
              <label htmlFor="form" className="mb-4">
                結果送信日時
              </label>
              <div className="flex flex-row items-center gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <select
                      id="weekday"
                      {...register("resultSendWeekday", { required: false })}
                      className="w-[100px] border border-gray-300 rounded p-2"
                    >
                      <option value="">日</option>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>
                    <span className="text-sm text-gray-500">日後の</span>
                  </div>
                </div>

                {/* 時間入力 */}
                <div className="flex flex-col">
                  <input
                    id="hour"
                    type="number"
                    min={0}
                    max={23}
                    placeholder="時間"
                    {...register("resultSendHour", { required: false })}
                    className="w-16 border rounded p-2"
                  />
                </div>
                <span className="text-sm text-gray-500">時</span>

                {/* 分入力 */}
                <div className="flex flex-col">
                  <input
                    id="minute"
                    type="number"
                    min={0}
                    max={59}
                    placeholder="分"
                    {...register("resultSendMinute", { required: false })}
                    className="w-16 border rounded p-2"
                  />
                </div>
                <span className="text-sm text-gray-500">分</span>
              </div>
            </div>
          )}

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
