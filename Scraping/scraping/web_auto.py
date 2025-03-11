import os
import sys
sys.path.append('C:/arupaka-db-manager/Scraping')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scraping.settings')
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
import re
import time
import asyncio
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from lxml import html
from scraping.department_adjust import department_adjust 
from scraping.campus_translation import campus_translation

from scraping.save_lecture_data import save_lecture_data
from scraping.get_classroom_info import get_classroom_info
from scraping.get_campus_info import get_campus_info

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

    DEPARTMENT_SELECT_START_NUMBER=2
    DEPARTMENT_SELECT_END_NUMBER=18

    for d in range(DEPARTMENT_SELECT_START_NUMBER, DEPARTMENT_SELECT_END_NUMBER):
        department_select = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="search-detail"]/table/tbody/tr[1]/td/select'))
        )
        department_select.click()

        department = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, f'//*[@id="search-detail"]/table/tbody/tr[1]/td/select/option[{d}]'))
        )
        department.click()

        SEMESTER_SELECT_START_NUMBER=3
        SEMESTER_SELECT_END_NUMBER=5
        FALL_SEMESTER_NUMBER=4

        for a in range(SEMESTER_SELECT_START_NUMBER, SEMESTER_SELECT_END_NUMBER):
            semester = (a == FALL_SEMESTER_NUMBER)
            
            semester_select = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="search-detail"]/table/tbody/tr[2]/td/select[2]'))
            )
            semester_select.click()

            semester_element = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, f'//*[@id="search-detail"]/table/tbody/tr[2]/td/select[2]/option[{a}]'))
            )
            semester_element.click()

            PERIOD_SELECT_START_NUMBER=2
            PERIOD_SELECT_END_NUMBER=7

            for b in range(PERIOD_SELECT_START_NUMBER, PERIOD_SELECT_END_NUMBER):  
                period_select = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, '//*[@id="search-detail"]/table/tbody/tr[3]/td/img'))
                )
                driver.execute_script("arguments[0].scrollIntoView();", period_select)
                period_select.click()

                if b == PERIOD_SELECT_START_NUMBER and not (d == DEPARTMENT_SELECT_START_NUMBER and a == SEMESTER_SELECT_START_NUMBER and b == PERIOD_SELECT_START_NUMBER):
                    period_select_b6 = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, f'//*[@id="period"]/table/tbody/tr[1]/th[6]'))
                    )
                    driver.execute_script("arguments[0].scrollIntoView();", period_select_b6)
                    period_select_b6.click()
                    time.sleep(1)

                if b != PERIOD_SELECT_START_NUMBER:
                    prev_day = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, f'//*[@id="period"]/table/tbody/tr[1]/th[{b-1}]'))
                    )
                    prev_day.click()
                    time.sleep(1)

                period_element = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, f'//*[@id="period"]/table/tbody/tr[1]/th[{b}]'))
                )

                period_element.click()
                time.sleep(1)

                decision = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, '//*[@id="panel_timetable"]/div[3]/input'))
                )
                decision.click()

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
                        
                        SYLLABUS_SELECT_START_NUMBER=2
                        SYLLABUS_SELECT_END_NUMBER=52

                        for j in range(SYLLABUS_SELECT_START_NUMBER, SYLLABUS_SELECT_END_NUMBER):
                            html_content = driver.page_source
                            tree = html.fromstring(html_content)

                            xpath_lecture = f"/html/body/div[1]/div[2]/div/div/form/table/tbody/tr[{j}]/td[2]/a"
                            xpath_teacher = f"/html/body/div[1]/div[2]/div/div/form/table/tbody/tr[{j}]/td[6]"
                            xpath_credits = f"/html/body/div[1]/div[2]/div/div/form/table/tbody/tr[{j}]/td[8]"  
                            xpath_daytime = f"/html/body/div[1]/div[2]/div/div/form/table/tbody/tr[{j}]/td[4]" 
                            xpath_schoolYear = f"/html/body/div[1]/div[2]/div/div/form/div[1]/div[5]/table/tbody/tr[2]/td/select[1]/option[1]"
                            xpath_campus = f"/html/body/div[1]/div[2]/div/div/form/table/tbody/tr[{j}]/td[5]"

                            lecture_element = tree.xpath(xpath_lecture)
                            teacher_element = tree.xpath(xpath_teacher)
                            credits_element = tree.xpath(xpath_credits)
                            daytime_element = tree.xpath(xpath_daytime)
                            schoolYear_element = tree.xpath(xpath_schoolYear)
                            campus_element = tree.xpath(xpath_campus)

                            if lecture_element:
                                lecture = lecture_element[0].text_content()
                                if campus_element:
                                    campus_text = campus_element[0].text_content()
                                    # "/" で分割し、最後の要素を取得する
                                    campus_raw = campus_text.split('/')[-1].strip() if '/' in campus_text else campus_text
                                else:
                                    campus_raw = "None"

                                campus_name = campus_translation.get(campus_raw, "None")
                                
                                # '§' が含まれているか確認
                                if '§' in lecture:
                                    # '§' で分割
                                    lecture_parts = lecture.split('§')
                                    for part in lecture_parts:
                                        part = part.strip()  # 前後の空白を除去

                                        # ':' で分割して授業コードと授業名を取得
                                        if ':' in part:
                                            class_code, class_name = part.split(':', 1)
                                        else:
                                            class_code = "不明"  # 授業コードがない場合は "不明" とする
                                            class_name = part

                                        data = {
                                            "academic": department_adjust(d),
                                            "classCode": class_code.strip(), 
                                            "name": class_name.strip(),
                                            "syllabus": "https://ct.ritsumei.ac.jp" + lecture_element[0].get('href'), 
                                            "teacher": teacher_element[0].text_content(),
                                            "credits": credits_element[0].text_content(),
                                            "weekday": daytime_element[0].text_content()[0] if daytime_element else "不明",
                                            "period": daytime_element[0].text_content()[1:] if daytime_element else "不明",
                                            "classroom": await get_classroom_info("https://ct.ritsumei.ac.jp" + lecture_element[0].get('href')),
                                            "schoolYear": schoolYear_element[0].text_content(),
                                            "campus": campus_name,
                                        }
                                        await save_lecture_data(data, semester)
                                else:
                                    # '§' が含まれていない場合、そのまま処理
                                    class_code = lecture.split(':', 1)[0]
                                    class_name = lecture.split(':', 1)[1] if ':' in lecture else "不明"

                                    data = {
                                        "academic": department_adjust(d),
                                        "classCode": class_code.strip(), 
                                        "name": class_name.strip(),
                                        "syllabus": "https://ct.ritsumei.ac.jp" + lecture_element[0].get('href'), 
                                        "teacher": teacher_element[0].text_content(),
                                        "credits": credits_element[0].text_content(),
                                        "weekday": daytime_element[0].text_content()[0] if daytime_element else "不明",
                                        "period": daytime_element[0].text_content()[1:] if daytime_element else "不明",
                                        "classroom": await get_classroom_info("https://ct.ritsumei.ac.jp" + lecture_element[0].get('href')),
                                        "schoolYear": schoolYear_element[0].text_content(),
                                        "campus": campus_name,
                                    }
                                    await save_lecture_data(data, semester)


                        try:
                            next_button = WebDriverWait(driver, 5).until(
                            EC.presence_of_element_located((By.XPATH, '//*[@id="AFHasNext"]'))
                            )

                            if "disabled" in next_button.get_attribute("class"):
                                break  # 次の曜日のループへ進む
                            else:
                                next_button.click()
                                time.sleep(2)  # ページ読み込み待機

                        except TimeoutException:
                            break  # 次の曜日へ進む

    driver.quit()

if __name__ == "__main__":
    asyncio.run(web_search()) 


