from rest_framework import serializers
from .models import Category, MenuItem, Cart

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'slug', 'title']

class MenuItemSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = MenuItem
        fields = ['id', 'title', 'price', 'featured', 'description', 'image', 'category', 'category_id']

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ["id", "menuitem", "quantity", "unit_price", "price"]
        read_only_fields = ["unit_price", "price"]