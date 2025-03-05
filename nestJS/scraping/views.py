from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import Kamoku
from .serializers import MyModelSerializer
import asyncio
from .web_auto import web_search  # スクレイピングコードをscraper.pyとして分離

class KamokuViewSet(viewsets.ModelViewSet):
    queryset = Kamoku.objects.all()
    serializer_class = MyModelSerializer

@api_view(['GET'])
def scrape_and_store(request):
    """
    スクレイピングを実行し、データを取得してデータベースに保存するAPIエンドポイント
    """
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(run_scraper())
    return Response({"message": "Scraping and data storage completed."})

async def run_scraper():
    """
    非同期スクレイピング実行 & データ保存
    """
    scraped_data = await web_search()
    for data in scraped_data:
        Kamoku.objects.update_or_create(
            classCode=data['classCode'],
            defaults={
                "schoolYear": data['schoolYear'],
                "name": data['name'],
                "classroom": data['classroom'],
                "teacher": data['teacher'],
                "syllabus": data['syllabus'],
                "weekday": data['weekday'],
                "period": data['period'],
                "academic": data['academic'],
                "credits": data['credits'],
                "semester": data['semester'],
            }
        )
