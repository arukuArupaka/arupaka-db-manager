from selenium import webdriver
from selenium.webdriver.common.by import By

# WebDriverの設定
options = webdriver.ChromeOptions()
options.add_argument("--headless")  # GUIを表示しない
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

# WebDriverを起動
driver = webdriver.Chrome(options=options)

try:
    # サンプルURLにアクセス
    url = "https://www.google.co.jp/"
    driver.get(url)
    print("Page title is:", driver.title)
finally:
    driver.quit()
