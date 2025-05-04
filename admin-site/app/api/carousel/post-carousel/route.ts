import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const requestUrl = process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL + "/carousel/add";

export async function POST(req: Request) {
  try {
    console.log("POSTリクエストを受信しました");
    // FormData を取得
    const formData = await req.formData();

    const image = formData.get("image") as File | null;

    // 必須フィールドのバリデーション
    if (!image) {
      return NextResponse.json({ error: "画像は必須です" }, { status: 400 });
    }

    const res = await fetch(requestUrl, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      console.log("res not ok:" + res);
      return NextResponse.json({ error: "カルーセルアイテムの追加に失敗しました" }, { status: 500 });
    }

    // 成功レスポンスを返す
    return NextResponse.json(
      {
        message: "カルーセルアイテムが正常に保存されました",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("エラーが発生しました:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
