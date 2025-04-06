from django.db import models
from django.forms import ValidationError
from accounts.models import CustomUser
from django.core.validators import MinValueValidator
from django.utils import timezone
from datetime import timedelta

def default_end_time():
    return timezone.now() + timedelta(days=30)

class Project(models.Model):
    id = models.BigAutoField(primary_key=True) 
    title = models.CharField(max_length=250)
    details = models.TextField()
    total_target = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(1)]
    )
    start_time = models.DateTimeField(default=timezone.now, blank=True)  
    end_time = models.DateTimeField(default=default_end_time, blank=True)  
    image = models.ImageField(upload_to='projects/images/', null=True, blank=True)
    creator = models.ForeignKey(
    CustomUser, 
    on_delete=models.SET_NULL, 
    null=True, 
    blank=True  
)

    updated_at = models.DateTimeField(auto_now=True)  
    created_at = models.DateTimeField(default=timezone.now, editable=False)  

    def clean(self):
        if self.start_time and self.end_time:
            if self.end_time <= self.start_time:
                raise ValidationError("End time must be after start time") 
            if self.start_time < timezone.now():
                raise ValidationError("Start time cannot be in the past")

    def __str__(self):
        return self.title
