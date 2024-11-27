# ベースイメージ
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# NestJSビルド
RUN npm run build

# アプリケーションを起動
CMD ["npm", "run", "start:prod"]
