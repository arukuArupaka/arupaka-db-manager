import asyncio
import aiohttp
from lxml import html

async def get_campus_info(syllabus):
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
pass