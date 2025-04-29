"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSchedules } from "@/functions/line-bot/createSchedules";
import { set, useForm, useWatch } from "react-hook-form";
import { ScreenScheduleData } from "@/components/dashboard/line-bot/columns";
import { updateSchedules } from "@/functions/line-bot/updateSchedules";

interface FormValues {
  weekday: number | null;
  hour: number;
  minute: number;
  description: string;
  message: string;
}

export default function UpdateModal({
  isOpenModal,
  setIsOpenModal,
  fetchSchedules,
  info,
}: {
  from?: string;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchSchedules: (method?: string) => Promise<void>;
  info: ScreenScheduleData | null;
}) {
  const dayMap: Record<string, number> = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };

  function convertWeekdayToNumber(
    weekday: string | null | undefined
  ): number | null {
    return !!weekday ? dayMap[weekday] : null;
  }

  // フォーム入力状態

  const { register, handleSubmit, control, reset } = useForm<FormValues>();

  // infoが来たら初期化する
  useEffect(() => {
    if (info) {
      console.log("info", info, convertWeekdayToNumber(info.weekday));
      reset({
        weekday: convertWeekdayToNumber(info.weekday),
        hour: info.hour,
        minute: info.minute,
        description: info.description,
        message: info.message,
      });
    }
  }, [info, reset]);

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
  const onSubmit = async (data: FormValues) => {
    try {
      // 入力値でAPI呼び出し
      await updateSchedules(
        info?.scheduleId as string,
        Number(data.weekday),
        Number(data.hour),
        Number(data.minute),
        data.description,
        data.message,
        fetchSchedules
      );
      // フォーム送信後、モーダルを閉じる
      setIsOpenModal(false);
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
        <h2 className="text-2xl font-bold mb-4">スケジュールの編集</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 曜日の選択 */}
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
          {/* ボタン群 */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpenModal(false)}
            >
              キャンセル
            </Button>
            <Button type="submit">編集</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
