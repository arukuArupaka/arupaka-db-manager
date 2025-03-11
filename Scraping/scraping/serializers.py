from rest_framework import serializers
from .models import Lecture

class MyModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = '__all__'
