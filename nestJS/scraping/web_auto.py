import os
import sys
sys.path.append('C:/arupaka-db-manager/nestJS')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scraping.settings')
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
from scraping.models import Kamoku
import re
import time
import aiohttp
import asyncio
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from lxml import html
from department_adjust import department_adjust
from day_translation import day_translation
from asgiref.sync import sync_to_async

async def save_kamoku_data(data, semester):
    period_str = data["period"].strip()
    day_period_list = []
    default_weekday = data.get("weekday", None)

    # `,` で分割して個別に処理
    parts = period_str.split(",")
    for part in parts:
        part = part.strip()

        # 曜日と範囲（例: 火5-6）
        match = re.match(r"([月火水木金土日])?(\d+)(?:-(\d+))?", part)
        if match:
            day, start_period, end_period = match.groups()

            # 曜日がない場合、デフォルトの曜日を使う
            if not day and default_weekday:
                day = default_weekday
            day = day_translation.get(day, day)

            # 時限が範囲指定 (例: 5-6)
            if start_period and end_period:
                for period in range(int(start_period), int(end_period) + 1):
                    day_period_list.append((day, period))
            elif start_period:  # 単一の時限 (例: 5)
                day_period_list.append((day, int(start_period)))
        else:
            print(f"無効なデータ: {part}")

    # Kamokuモデルにデータを保存
    for day, period in day_period_list:
        await sync_to_async(Kamoku.objects.create, thread_sensitive=True)(
            academic=data["academic"],
            classCode=data["classCode"],
            name=data["name"],
            syllabus=data["syllabus"],
            semester=semester,
            teacher=data["teacher"],
            credits=data["credits"],
            weekday=day,
            period=period,
            classroom=data["classroom"],
            schoolYear=data["schoolYear"]
        )

async def get_classroom_info(syllabus):
    # 非同期でHTMLコンテンツを取得
    async with aiohttp.ClientSession() as session:
        async with session.get(syllabus) as response:
            html_content = await response.text()

    # HTMLを解析
    tree = html.fromstring(html_content)

    # 教室情報を取得するためのXPathを追加
    classroom_xpath = '//*[@id="table-syllabusitems"]/div/div[2]' 
    classroom_element = tree.xpath(classroom_xpath)

    if classroom_element:
        classroom = classroom_element[0].text_content().strip()  # .text_content()を使用してテキストを取得
        return classroom
    else:
        return "教室情報が見つかりませんでした。"



async def web_search():
    options = webdriver.ChromeOptions()
    options.add_argument("disable-blink-features=AutomationControlled")

    # Chromeドライバの設定
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
    driver.implicitly_wait(10)

    driver.get('https://ct.ritsumei.ac.jp/syllabussearch/')

    # 1ページに表示する結果数の指定
    page = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, '//*[@id="target_result_par_page"]/select'))
    )
    page.click()
    page_qty = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, '//*[@id="target_result_par_page"]/select/option[3]'))
    )
    page_qty.click()


    for d in range(2, 18):
        department_select = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="search-detail"]/table/tbody/tr[1]/td/select'))
        )
        department_select.click()

        department = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, f'//*[@id="search-detail"]/table/tbody/tr[1]/td/select/option[{d}]'))
        )
        department.click()

        for a in range(3, 5):
            semester = (a == 4)
            
            semester_select = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="search-detail"]/table/tbody/tr[2]/td/select[2]'))
            )
            semester_select.click()

            semester_element = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, f'//*[@id="search-detail"]/table/tbody/tr[2]/td/select[2]/option[{a}]'))
            )
            semester_element.click()

            for b in range(2, 7):  
                koma_select = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, '//*[@id="search-detail"]/table/tbody/tr[3]/td/img'))
                )
                driver.execute_script("arguments[0].scrollIntoView();", koma_select)
                koma_select.click()

                if b == 2 and not (d == 2 and a == 3 and b == 2):
                    koma_select_b6 = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, f'//*[@id="period"]/table/tbody/tr[1]/th[6]'))
                    )
                    driver.execute_script("arguments[0].scrollIntoView();", koma_select_b6)
                    koma_select_b6.click()
                    time.sleep(1)

                if b != 2:
                    prev_day = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, f'//*[@id="period"]/table/tbody/tr[1]/th[{b-1}]'))
                    )
                    prev_day.click()
                    time.sleep(1)

                koma = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, f'//*[@id="period"]/table/tbody/tr[1]/th[{b}]'))
                )

                koma.click()
                time.sleep(1)

                kettei = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, '//*[@id="panel_timetable"]/div[3]/input'))
                )
                kettei.click()

                WebDriverWait(driver, 10).until(
                    lambda d: d.execute_script("return document.readyState") == "complete"
                )

                # **シラバス情報の取得**
                html_content = driver.page_source
                tree = html.fromstring(html_content)

                page = tree.xpath("/html/body/div[1]/div[2]/div/div/form/div[2]/div[2]/span[1]")
                if not page:
                        print("ページ総数の取得に失敗しました。スキップします。")
                        continue

                page_qty = page[0].text_content()
                page_all = re.sub(r"\D", "", page_qty)
                rem = int(page_all) % 50
                page_all_qty = (int(page_all) // 50) + (1 if rem > 0 else 0)

                for i in range(int(page_all_qty)):
                        for j in range(2, 52):
                            html_content = driver.page_source
                            tree = html.fromstring(html_content)

                            xpath_kamoku = f"/html/body/div[1]/div[2]/div/div/form/table/tbody/tr[{j}]/td[2]/a"
                            xpath_teacher = f"/html/body/div[1]/div[2]/div/div/form/table/tbody/tr[{j}]/td[6]"
                            xpath_credits = f"/html/body/div[1]/div[2]/div/div/form/table/tbody/tr[{j}]/td[8]"
                            xpath_daytime = f"/html/body/div[1]/div[2]/div/div/form/table/tbody/tr[{j}]/td[4]"
                            xpath_schoolYear = f"/html/body/div[1]/div[2]/div/div/form/div[1]/div[5]/table/tbody/tr[2]/td/select[1]/option[1]"

                            element_kamoku = tree.xpath(xpath_kamoku)
                            element_teacher = tree.xpath(xpath_teacher)
                            element_credits = tree.xpath(xpath_credits)
                            element_daytime = tree.xpath(xpath_daytime)
                            element_schoolYear = tree.xpath(xpath_schoolYear)

                            if element_kamoku:
                                data = {
                                    "academic": department_adjust(d),
                                    "classCode": element_kamoku[0].text_content().split(':', 1)[0], 
                                    "name": element_kamoku[0].text_content().split(':', 1)[1], 
                                    "syllabus": "https://ct.ritsumei.ac.jp" + element_kamoku[0].get('href'), 
                                    "teacher": element_teacher[0].text_content(),
                                    "credits": element_credits[0].text_content(),
                                    "weekday": element_daytime[0].text_content()[0] if element_daytime else "不明",
                                    "period": element_daytime[0].text_content()[1:] if element_daytime else "不明",
                                    "classroom": await get_classroom_info("https://ct.ritsumei.ac.jp" + element_kamoku[0].get('href')),
                                    "schoolYear": element_schoolYear[0].text_content(),
                                }
                                await save_kamoku_data(data, semester) 

                        try:
                            next_button = WebDriverWait(driver, 5).until(
                            EC.presence_of_element_located((By.XPATH, '//*[@id="AFHasNext"]'))
                            )

                            if "disabled" in next_button.get_attribute("class"):
                                print("「次へ」ボタンが無効。次の曜日へ進みます。")
                                break  # 次の曜日のループへ進む
                            else:
                                next_button.click()
                                time.sleep(2)  # ページ読み込み待機

                        except TimeoutException:
                            print("「次へ」ボタンが見つからず、次の曜日へ進みます。")
                            break  # 次の曜日へ進む

    driver.quit()

if __name__ == "__main__":
    asyncio.run(web_search()) 


