export interface RecievedListingItemPayload {
  documentId: string; //FirebaseにおけるID
  purchasedAt?: Date; //購入した日時
  purchasedUserId?: string; //購入したユーザーのid
  condition: Condition; //商品の状態
  department: Academics; //学部
  description?: string; //商品の説明
  imageUrl: string[]; //商品の画像のURL
  price: number; //商品の価格
  name: string; //商品
  firebaseUserId: string; //ユーザーID
}

export interface ListingItemPayload extends RecievedListingItemPayload {
  id: number; //ID
  createdAt: Date; //出品された日時
}
export type Condition =
  | 'BRAND_NEW' //新品、未使用
  | 'LIKE_NEW' //未使用に近い
  | 'GOOD' //目立った傷や汚れなし
  | 'FAIR' //やや傷や汚れあり
  | 'POOR' //傷や汚れあり
  | 'BAD'; //全体的に状態が悪い

export type Academics =
  | 'Law' // 法学部
  | 'SocialSciences' // 社会学部
  | 'InternationalRelations' // 国際関係学部
  | 'Letters' // 文学部
  | 'Economics' // 経済学部
  | 'SportandHealthScience' // スポーツ健康科学部
  | 'ScienceandEngineering' // 理工学部
  | 'LifeSciences' // 生命科学部
  | 'PharmaceuticalSciences' // 薬学部
  | 'GastronomyManagement' // 食マネジメント学部
  | 'BusinessAdministration' // 経営学部
  | 'PolicyScience' // 政策科学部
  | 'ComprehensivePsychology' // 総合心理学部
  | 'GlobalLiberalArts' // グローバル教養学部
  | 'ImageArtsandSciences' // 映像学部
  | 'InformationScienceandEngineering'; // 情報理工学部
