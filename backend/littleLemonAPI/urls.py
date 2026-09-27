from django.urls import path
from . import views
urlpatterns = [
    path('menu-items', views.Menu_Items.as_view()),
    path('menu-items/<int:pk>', views.MenuItemDetailView.as_view()),
    path('cart/menu-items', views.CartView.as_view()),
    path('cart/menu-items/<int:menuitem_id>', views.CartItemDeleteView.as_view()),
    path('orders', views.OrderListCreateView.as_view()),
    path('orders/<int:orderId>', views.OrderDetailUpdateView.as_view()),
    path('reservations/availability', views.ReservationAvailabilityView.as_view()),
    path('reservations', views.ReservationListCreateView.as_view()),
    path('reservations/<uuid:confirmation_code>', views.ReservationConfirmationView.as_view()),
    path('reservations/<uuid:confirmation_code>/cancel', views.ReservationCancelView.as_view()),
]