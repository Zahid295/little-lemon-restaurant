from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.paginator import Paginator, EmptyPage
from django.shortcuts import get_object_or_404
from django.db import models
from datetime import date
from django.contrib.auth.models import User
from .models import MenuItem, Cart, Order, OrderItem
from .serializers import MenuItemSerializer, CartSerializer, OrderSerializer, UserSerializer

# Create your views here.

class Menu_Items(generics.ListCreateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny] 

    def get_queryset(self):
        queryset = MenuItem.objects.select_related('category').all()

        category = self.request.query_params.get("category")
        price = self.request.query_params.get("price")
        search = self.request.query_params.get("search")
        perpage = int(self.request.query_params.get("perpage", 2))
        page = int(self.request.query_params.get("page", 1))

        # Filter by category title or slug
        if category:
            queryset = queryset.filter(
                models.Q(category__title__iexact=category) |
                models.Q(category__slug__iexact=category)
            )

        # Filter by price
        if price:
            queryset = queryset.filter(price__lte=price)

        # Search by title
        if search:
            queryset = queryset.filter(title__istartswith=search)

        # Pagination
        paginator = Paginator(queryset, per_page=perpage)
        try:
            queryset = paginator.page(number=page)
        except EmptyPage:
            queryset = []

        return queryset

    def post(self, request):
        # Manager-only access
        if not request.user.groups.filter(name='Manager').exists():
            return Response({"message": "Access Denied"}, status=status.HTTP_403_FORBIDDEN)

        serializer = MenuItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class MenuItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MenuItem.objects.select_related('category').all()
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]

    def put(self, request, pk):
        # Manager-only access
        if not request.user.groups.filter(name='Manager').exists():
            return Response({"message": "Access Denied"}, status=status.HTTP_403_FORBIDDEN)

        item = get_object_or_404(MenuItem, pk=pk)
        serialized_item = MenuItemSerializer(item, data=request.data)

        if serialized_item.is_valid():
            serialized_item.save()
            return Response(serialized_item.data, status=status.HTTP_200_OK)

        return Response(serialized_item.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        # Manager-only access
        if not request.user.groups.filter(name='Manager').exists():
            return Response({"message": "Access Denied"}, status=status.HTTP_403_FORBIDDEN)

        item = get_object_or_404(MenuItem, pk=pk)
        serialized_item = MenuItemSerializer(item, data=request.data, partial=True)

        if serialized_item.is_valid():
            serialized_item.save()
            return Response(serialized_item.data, status=status.HTTP_200_OK)

        return Response(serialized_item.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        # Manager-only access
        if not request.user.groups.filter(name='Manager').exists():
            return Response({"message": "Access Denied"}, status=status.HTTP_403_FORBIDDEN)

        item = get_object_or_404(MenuItem, pk=pk)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CartView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
    
    def create(self, request):
        menuitem_id = request.data.get("menuitem")
        quantity = int(request.data.get("quantity", 1))

        menuitem = get_object_or_404(MenuItem, id=menuitem_id)

        unit_price = menuitem.price
        price = unit_price * quantity

        cart_item, created = Cart.objects.update_or_create(
            user=request.user,
            menuitem=menuitem,
            defaults={
                "quantity": quantity,
                "unit_price": unit_price,
                "price": price
            }
        )
        serialized_item = CartSerializer(cart_item)
        return Response(serialized_item.data, status.HTTP_201_CREATED)
    
    def delete(self, request):
        Cart.objects.filter(user=request.user).delete()
        return Response({"message": "Cart removed"}, status.HTTP_200_OK)
    

class OrderListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        if self.request.user.groups.filter(name="Manager").exists():
            return Order.objects.all()
        
        if self.request.user.groups.filter(name="Delivery Crew").exists():
            return Order.objects.filter(delivery_crew=self.request.user)
        
        return Order.objects.filter(user=self.request.user)
    
    def create(self, request):
        user = request.user
        cart_items = Cart.objects.filter(user=user)
        if not cart_items.exists():
            return Response({"message": "Cart is empty"}, status.HTTP_400_BAD_REQUEST)
        
        total = sum(item.price for item in cart_items)

        order = Order.objects.create(
            user=user,
            total=total,
            date=date.today()
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                menuitem=item.menuitem,
                quantity=item.quantity,
                unit_price=item.unit_price,
                price=item.price
            )

        cart_items.delete()
        serialized_order = OrderSerializer(order)
        return Response(serialized_order.data, status.HTTP_201_CREATED)
            
# Customer GET, Delivery Crew PATCH, Manager GET, PATCH, PUT and DELETE view
class OrderDetailUpdateView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    lookup_url_kwarg = "orderId"

    def get_queryset(self):
        if self.request.user.groups.filter(name="Manager").exists():
            return Order.objects.all()
        if self.request.user.groups.filter(name="Delivery Crew").exists():
                return Order.objects.filter(delivery_crew=self.request.user)
        return Order.objects.filter(user=self.request.user)
    
    def patch(self, request, orderId):
        return self.update(request, orderId)
    
    def update(self, request, orderId):
        user = request.user
        data = request.data
        
        try:
            order = Order.objects.get(id=orderId)
        except Order.DoesNotExist:
            return Response({"message": "Order not found"}, status.HTTP_404_NOT_FOUND)
        
        # Delivery crew logic
        if user.groups.filter(name="Delivery Crew").exists():
            if "status" not in data:
                return Response({"message": "Delivery crew can only update status"}, status.HTTP_403_FORBIDDEN)
            status_value = int(data["status"])
            if status_value not in (0, 1):
                return Response(
                    {"message": "Status must be 0 or 1"}, 
                    status.HTTP_400_BAD_REQUEST
                    )
            order.status = status_value
            order.save()
            serialized_order = OrderSerializer(order)
            return Response(serialized_order.data, status.HTTP_200_OK)
        
        # Customer logic
        if not user.groups.filter(name="Manager").exists():
            return Response({"message": "Only managers and delivery crew can update orders"}, status.HTTP_403_FORBIDDEN)

        # Manager logic
        if "delivery_crew" in data:
            crew_id = data["delivery_crew"]
            if not User.objects.filter(id=crew_id, groups__name="Delivery Crew").exists():
                return Response(
                    {"message": "delivery_crew must a valid delivery crew user"}, 
                    status.HTTP_400_BAD_REQUEST
                    )
            order.delivery_crew = User.objects.get(id=crew_id)

        if "status" in data:
            status_value = int(data["status"])
            if status_value not in (0, 1):
                return Response(
                    {"message": "Status must be 0 or 1"}, 
                    status.HTTP_400_BAD_REQUEST
                    )
            order.status = status_value

        order.save()
        serialized_order = OrderSerializer(order)
        return Response(serialized_order.data, status.HTTP_200_OK)
    
    def destroy(self, request, orderId):
        if not request.user.groups.filter(name="Manager").exists():
            return Response({"message": "Only managers can delete orders"}, status.HTTP_403_FORBIDDEN)
        try:
            order = Order.objects.get(id=orderId)
        except Order.DoesNotExist:
            return Response({"message": "Order not found"}, status.HTTP_404_NOT_FOUND)
        order.delete()
        return Response({"message": "Order deleted successfully"}, status.HTTP_200_OK)

