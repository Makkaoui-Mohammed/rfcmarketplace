from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

User = get_user_model()

class Ad(models.Model):
    titre = models.CharField(max_length=255)
    description = models.TextField()
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255)
    area = models.IntegerField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ads')
    image = models.ImageField(upload_to='ad_images/', blank=True, null=True)  

    def __str__(self):
        return self.titre
    
    
class Reservation(models.Model):
    ad = models.ForeignKey(Ad, on_delete=models.CASCADE, related_name='reservations')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    phone_number = models.CharField(max_length=15)
    reservation_date = models.DateField()
    reservation_time = models.TimeField()
    confirmed_by_buyer = models.BooleanField(default=False) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Reservation for {self.ad.titre} by {self.user.username}'

    
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Notification for {self.user.username}: {self.message}'
