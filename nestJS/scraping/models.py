from django.db import models

# Create your models here.
class Kamoku(models.Model):
    id = models.AutoField(primary_key=True)
    schoolYear = models.IntegerField(null=True)
    classCode = models.IntegerField()
    name = models.CharField(max_length=400)
    classroom  = models.CharField(max_length=400)
    teacher  = models.CharField(max_length=400)
    syllabus = models.CharField(max_length=400)
    weekday = models.CharField(max_length=400)
    period = models.IntegerField()
    academic  = models.CharField(max_length=400)
    campus = models.CharField(max_length=400, null=True)
    credits = models.IntegerField()
    semester = models.BooleanField(default=False)
    def __str__(self):
        return f'{self.name} - {self.classroom} - {self.teacher} - {self.syllabus} - {self.weekday} - {self.academic} - {self.semester} '