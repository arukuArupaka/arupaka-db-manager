"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function DataSubmissionPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [jsonText, setJsonData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidJson, setIsValidJson] = useState(true);

  const validateJson = (jsonString: string) => {
    if (!jsonString) {
      setIsValidJson(true);
      return true;
    }

    try {
      JSON.parse(jsonString);
      setIsValidJson(true);
      return true;
    } catch (e) {
      setIsValidJson(false);
      return false;
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonData(value);
    if (value) validateJson(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("タイトルが空です");
      return;
    }

    if (!message) {
      alert("メッセージが空です");
      return;
    }

    if (!jsonText) {
      alert("JSONデータが空です");
      return;
    }

    if (!validateJson(jsonText)) {
      alert("無効なJSON形式です");
      return;
    }

    setIsSubmitting(true);

    const jsonData = JSON.parse(jsonText);
    const data = {
      title: title,
      message: message,
      data: jsonData,
    };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ARUPAKA_DB_URL}/device_token/push_notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        alert("データの送信に失敗しました");
        throw new Error(`${res}`);
      }

      alert("データが送信されました");

      // フォームをリセット
      setTitle("");
      setMessage("");
      setJsonData("");
    } catch (error) {
      alert("データの送信に失敗しました(詳しくはコンソールを確認してください)");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">データ送信</h1>
        <p className="text-muted-foreground">
          データベースやエンドポイントにデータを送信します。
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              タイトル
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タイトルを入力してください"
              className="max-w-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              メッセージ
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="メッセージを入力してください"
              className="max-w-md h-24"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="jsonData" className="text-sm font-medium">
              JSONデータ
            </label>
            <Textarea
              id="jsonData"
              value={jsonText}
              onChange={handleJsonChange}
              placeholder='{"key": "value", "example": [1, 2, 3]}'
              className={`font-mono h-64 ${
                !isValidJson ? "border-red-500" : ""
              }`}
            />
            {!isValidJson && (
              <p className="text-sm text-red-500">
                有効なJSON形式ではありません
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !isValidJson}
            onClick={handleSubmit}
          >
            {isSubmitting ? "送信中..." : "データを送信"}
          </Button>
        </form>
      </div>
    </div>
  );
}
