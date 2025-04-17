import { Academics } from "./Academics";
import { Condition } from "./Condition";
//TODO departmentはnest側で名称変更されてるので対応
export interface TextBook {
  documentId: string; //FirebaseにおけるID
  purchasedAt?: Date; //購入した日時
  purchasedUserId?: string; //購入したユーザーのid
  condition: Condition; //商品の状態
  department: Academics; //学部
  description?: string; //商品の説明
  imageUrls: string[];
  price: number; //商品の価格
  name: string; //商品
  firebaseUserId: string; //ユーザーID
  id: number; //ID
  createdAt: Date; //出品された日時
}
