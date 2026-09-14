from django.urls import path
from . import views
urlpatterns = [
    path('menu-items', views.Menu_Items.as_view()),
    path('menu-items/<int:pk>', views.MenuItemDetailView.as_view()),
    path('cart/menu-items', views.CartView.as_view()),
    path('orders', views.OrderListCreateView.as_view()),
    path('orders/<int:orderId>', views.OrderDetailUpdateView.as_view()),
]