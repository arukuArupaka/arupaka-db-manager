import asyncio
import re
from scraping.models import Lecture
from asgiref.sync import sync_to_async
from scraping.day_translation import day_translation

async def save_lecture_data(data, semester):
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

    # Lectureモデルにデータを保存
    for day, period in day_period_list:
        await sync_to_async(Lecture.objects.create, thread_sensitive=True)(
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
            schoolYear=data["schoolYear"],
            campus=data["campus"]
        )
pass