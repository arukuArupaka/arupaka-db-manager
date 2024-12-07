# 時間を計るライブラリをインポート
import time
# WebDriverライブラリをインポート
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# Chromeを指定する
driver = webdriver.Chrome()
# Chromeを開いてGoogleにアクセスする
driver.get('https://www.google.com/')

# 5秒待機する
time.sleep(5)

# ページ内でname属性がqの要素を指定する（検索ボックス）
search_box = driver.find_element(By.NAME,'q')
# 指定した要素（検索ボックス）にChromeDriverと入力する
search_box.send_keys('ChromeDriver')
# フォームを送信する（検索する）
search_box.submit()

# 5秒待機する
time.sleep(5)

# Webページのスクリーンショットを保存する（保存先はカレントディレクトリ）
driver.save_screenshot('selenium_schreenshot_test.png')

# 画面を閉じる
driver.quit()