from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.paginator import Paginator, EmptyPage
from django.shortcuts import get_object_or_404
from django.db import models

from .models import MenuItem
from .serializers import MenuItemSerializer

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
