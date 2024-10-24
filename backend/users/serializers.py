from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Ad, User, Reservation, Notification
from django.core.validators import RegexValidator 

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


        
        
class AdSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(source='owner.username', read_only=True)
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = Ad
        fields = ['id', 'titre', 'description', 'prix', 'location', 'area', 'owner', 'image']
        
        
        
class ReservationSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(required=True, validators=[
        RegexValidator(regex=r'^\d{10,15}$', message="Le numéro de téléphone doit contenir entre 10 et 15 chiffres.")
    ])
    reservation_date = serializers.DateField(required=True)
    reservation_time = serializers.TimeField(required=True)

    class Meta:
        model = Reservation
        fields = ['ad', 'user', 'phone_number', 'reservation_date', 'reservation_time']
        
        
        
class NotificationSerializer(serializers.ModelSerializer):
    reservation_id = serializers.IntegerField(source='reservation.id', read_only=True)
    reservation_date = serializers.DateField(source='reservation.reservation_date', read_only=True)
    reservation_time = serializers.TimeField(source='reservation.reservation_time', read_only=True)
    phone_number = serializers.CharField(source='reservation.phone_number', read_only=True)
    ad_title = serializers.CharField(source='reservation.ad.titre', read_only=True)
    user_name = serializers.CharField(source='reservation.user.username', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'message', 'is_read', 'created_at',
            'reservation_id', 'reservation_date', 
            'reservation_time', 'phone_number', 
            'ad_title', 'user_name'
        ]