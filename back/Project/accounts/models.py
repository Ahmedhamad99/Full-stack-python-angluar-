from django.db import models
from django.contrib.auth.models import AbstractUser
import phonenumbers
from django.core.exceptions import ValidationError

def validate_number(value):
    try:
        phone_number = phonenumbers.parse(value, 'EG')
        if not phonenumbers.is_valid_number(phone_number):
            raise ValidationError("Invalid Egyptian Phone Number format")
    except:
        raise ValidationError("Invalid Phone Number Format")

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    mobile_phone = models.CharField(
        max_length=15,
        unique=True,
        validators=[validate_number]  
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'mobile_phone']
    
    def __str__(self):
        return self.email

