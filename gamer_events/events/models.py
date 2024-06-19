from djongo import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)

    REQUIRED_FIELDS = ['email']

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

class Event(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    registration_deadline = models.DateTimeField()

class Team(models.Model):
    name = models.CharField(max_length=255)
    creator = models.ForeignKey(User, related_name='created_teams', on_delete=models.CASCADE)
    members = models.ManyToManyField(User, related_name='teams')

    def __str__(self):
        return self.name
    
class Participation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True)
