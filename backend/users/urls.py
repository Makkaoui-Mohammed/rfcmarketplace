from django.urls import path
from .views import UserRegistrationView, LoginView, LogoutView, CreateAdView, ListAdView, AdDetailView, MyAdsView, UpdateAdView, DeleteAdView, CreateReservationView, NotificationListView, ConfirmReservationView, RefuseReservationView


urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('ads/', CreateAdView.as_view(), name='create-ad'),
    path('ads/list/', ListAdView.as_view(), name='list-ads'),
    path('ads/<int:pk>/', AdDetailView.as_view(), name='ad-detail'),  
    path('my-ads/', MyAdsView.as_view(), name='my-ads'),
    path('ads/<int:pk>/update/', UpdateAdView.as_view(), name='update-ad'),
    path('ads/<int:pk>/reservation/', CreateReservationView.as_view(), name='create-reservation'),
    path('ads/<int:pk>/delete/', DeleteAdView.as_view(), name='delete-ad'),
    path('notifications/', NotificationListView.as_view(), name='notifications'),
    path('reservations/<int:reservation_id>/confirm/', ConfirmReservationView.as_view(), name='confirm-reservation'),
    path('reservations/<int:reservation_id>/refuse/', RefuseReservationView.as_view(), name='refuse-reservation'),
]
