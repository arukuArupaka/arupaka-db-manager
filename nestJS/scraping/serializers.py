from rest_framework import serializers
from .models import Kamoku

class MyModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kamoku
        fields = '__all__'
