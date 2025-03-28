import os
from django.http import HttpResponse
from django.core.serializers import serialize
from .models import Lecture
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import Lecture
from .serializers import MyModelSerializer
import asyncio
from .web_auto import web_search  
from .kamoku_status import update_lecture_category
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

class LectureViewSet(viewsets.ModelViewSet):
    queryset = Lecture.objects.all()
    serializer_class = MyModelSerializer

def dump_chunked_view(request):
    chunk_size = 10000  # チャンクサイズを調整
    qs = Lecture.objects.all().order_by('pk')
    total = qs.count()
    messages = [f"Total records: {total}"]

    # 出力ディレクトリのパスをプロジェクトのルート相対に指定（必要に応じて調整）
    output_dir = os.path.join(os.getcwd(), "dumped_data")
    os.makedirs(output_dir, exist_ok=True)

    for i in range(0, total, chunk_size):
        chunk = qs[i:i+chunk_size]
        data = serialize('json', chunk, indent=2)
        filename = os.path.join(output_dir, f"mymodel{i//chunk_size + 1}.json")
        with open(filename, "w", encoding="utf-8") as f:
            f.write(data)
        messages.append(f"Dumped records {i} to {i+chunk_size} into {filename}")

    response_text = "\n".join(messages)
    return HttpResponse(response_text, content_type="text/plain")

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
        Lecture.objects.update_or_create(
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

@csrf_exempt
def update_lecture_category_view(request):
    """ エンドポイントから update_lecture_category を実行するAPI """
    file_path = "C:/arupaka-db-manager/Scraping/scraping/DepInfo/ScienceandEngineering_lecture_data.xlsx"

    try:
        result = update_lecture_category(file_path)
    except FileNotFoundError as e:
        return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse(result, safe=False)  