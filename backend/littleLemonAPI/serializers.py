from rest_framework import serializers
from .models import Category, MenuItem, Cart, Order, OrderItem, User

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
    menuitem = MenuItemSerializer(read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "menuitem", "quantity", "unit_price", "price"]
        read_only_fields = ["unit_price", "price"]

class OrderItemSerializer(serializers.ModelSerializer):
    menuitem = MenuItemSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "menuitem", "quantity", "unit_price", "price"]


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True, source="orderitem_set")

    customer_name = serializers.CharField(max_length=255, allow_blank=False)
    customer_email = serializers.EmailField()
    customer_phone = serializers.CharField(max_length=32, allow_blank=False)
    order_type = serializers.ChoiceField(choices=Order.ORDER_TYPE_CHOICES)
    street = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")
    city = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")
    postcode = serializers.CharField(max_length=32, required=False, allow_blank=True, default="")

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "delivery_crew",
            "status",
            "total",
            "date",
            "customer_name",
            "customer_email",
            "customer_phone",
            "order_type",
            "street",
            "city",
            "postcode",
            "order_items",
        ]
        read_only_fields = ["id", "user", "delivery_crew", "status", "total", "date", "order_items"]

    def validate(self, attrs):
        if attrs.get("order_type") == "delivery":
            address_fields = ("street", "city", "postcode")
            missing_fields = [field for field in address_fields if not attrs.get(field, "").strip()]
            if missing_fields:
                raise serializers.ValidationError(
                    {field: "This field is required for delivery orders." for field in missing_fields}
                )
        return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]
