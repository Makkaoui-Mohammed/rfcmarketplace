from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, status, permissions
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import UserSerializer, LoginSerializer, AdSerializer, ReservationSerializer, NotificationSerializer
from .models import Ad, Reservation, Notification
from rest_framework import serializers  
from rest_framework.decorators import action


User = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(request, username=email, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Logged in successfully",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_id": user.id,  
                "username": user.username
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

from rest_framework.parsers import MultiPartParser, FormParser
@method_decorator(csrf_exempt, name='dispatch')
class CreateAdView(generics.CreateAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [permissions.IsAuthenticated]  

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        parser_classes = (MultiPartParser, FormParser)
    
class ListAdView(generics.ListAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [AllowAny]

class AdDetailView(generics.RetrieveAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [permissions.AllowAny]
    
class MyAdsView(generics.ListAPIView):
    serializer_class = AdSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Ad.objects.filter(owner=self.request.user)
    
class UpdateAdView(generics.UpdateAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class DeleteAdView(generics.DestroyAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    
class CreateReservationView(generics.CreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        try:
            ad = Ad.objects.get(pk=self.kwargs['pk'])
            user = self.request.user
            reservation = serializer.save(
                user=user,
                ad=ad,
                confirmed_by_buyer=False  
            )

           
            Notification.objects.create(
                user=ad.owner,
                reservation=reservation,
                message=(
                    f'Nouvelle réservation pour {ad.titre} par {user.username} '
                    f'(le {reservation.reservation_date} à {reservation.reservation_time}, '
                    f'tél: {reservation.phone_number})'
                )
            )

            print(f"Réservation créée avec succès pour l'annonce {ad.titre} par {user}")
        except Exception as e:
            print("Erreur lors de la création de la réservation:", e)
            raise serializers.ValidationError({'error': str(e)})

        
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user, is_read=False)
    
    
 
@method_decorator(csrf_exempt, name='dispatch')
class ConfirmReservationView(APIView):
    def post(self, request, reservation_id):
        try:
            reservation = Reservation.objects.get(id=reservation_id)
            reservation.confirmed_by_buyer = True
            reservation.save()

            
            notification = Notification.objects.filter(reservation=reservation, user=reservation.ad.owner).first()
            if notification:
                notification.message = 'Vous avez confirmé cette réservation.'
                notification.is_read = True
                notification.save()

            
            Notification.objects.create(
                user=reservation.user,
                reservation=reservation,
                message=f"Votre réservation pour '{reservation.ad.titre}' est confirmée.",
                is_read=False
            )

            return Response({"message": "Réservation confirmée avec succès."}, status=status.HTTP_200_OK)
        except Reservation.DoesNotExist:
            return Response({"error": "Réservation non trouvée."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class RefuseReservationView(APIView):
    def post(self, request, reservation_id):
        try:
            reservation = Reservation.objects.get(id=reservation_id)

            
            notification = Notification.objects.filter(reservation=reservation, user=reservation.ad.owner).first()
            if notification:
                notification.message = 'Vous avez refusé cette réservation.'
                notification.is_read = True
                notification.save()

            
            Notification.objects.create(
                user=reservation.user,
                reservation=reservation,
                message=f"Votre réservation pour '{reservation.ad.titre}' a été refusée.",
                is_read=False
            )

            return Response({"message": "Réservation refusée avec succès."}, status=status.HTTP_200_OK)
        except Reservation.DoesNotExist:
            return Response({"error": "Réservation non trouvée."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)