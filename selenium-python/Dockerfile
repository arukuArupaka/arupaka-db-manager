# ベースイメージ
FROM python:3.10-slim

# 必要な依存関係をインストール
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    unzip \
    chromium-driver \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

# Python依存関係をインストール
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# スクリプトをコピー
COPY . /app

# # スクリプト実行
CMD ["tail", "-f", "/dev/null"]
