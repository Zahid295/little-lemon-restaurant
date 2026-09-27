from datetime import datetime
from zoneinfo import ZoneInfo

from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category, MenuItem, Cart, Order, OrderItem, Reservation
from .reservation_services import get_reservation_slot_starts

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


class ReservationAvailabilitySerializer(serializers.Serializer):
    date = serializers.DateField()
    guests = serializers.IntegerField(
        min_value=settings.RESERVATION_MIN_GUESTS,
        max_value=settings.RESERVATION_MAX_GUESTS,
    )

    def validate_date(self, value):
        restaurant_timezone = ZoneInfo(settings.RESTAURANT_TIME_ZONE)
        if value < datetime.now(restaurant_timezone).date():
            raise serializers.ValidationError("Choose today or a future date.")
        return value


class ReservationSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(max_length=255, trim_whitespace=True)
    customer_email = serializers.EmailField()
    customer_phone = serializers.CharField(max_length=32, trim_whitespace=True)
    date = serializers.DateField(write_only=True)
    time = serializers.TimeField(write_only=True, input_formats=["%H:%M"])
    reservation_date = serializers.SerializerMethodField()
    reservation_time = serializers.SerializerMethodField()
    confirmation_code = serializers.UUIDField(read_only=True)
    status = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Reservation
        fields = [
            "id",
            "confirmation_code",
            "customer_name",
            "customer_email",
            "customer_phone",
            "date",
            "time",
            "reservation_date",
            "reservation_time",
            "guests",
            "occasion",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "confirmation_code", "status", "created_at"]

    def get_reservation_date(self, obj):
        return obj.starts_at.astimezone(ZoneInfo(settings.RESTAURANT_TIME_ZONE)).date().isoformat()

    def get_reservation_time(self, obj):
        return obj.starts_at.astimezone(ZoneInfo(settings.RESTAURANT_TIME_ZONE)).strftime("%H:%M")

    def validate_guests(self, value):
        if value > settings.RESERVATION_SLOT_CAPACITY:
            raise serializers.ValidationError("Party size exceeds slot capacity.")
        return value

    def validate(self, attrs):
        restaurant_timezone = ZoneInfo(settings.RESTAURANT_TIME_ZONE)
        local_start = datetime.combine(attrs["date"], attrs["time"]).replace(
            tzinfo=restaurant_timezone
        )
        available_slot_starts = get_reservation_slot_starts(attrs["date"])
        if local_start not in available_slot_starts:
            raise serializers.ValidationError(
                {"time": "Choose an available reservation time."}
            )
        attrs["starts_at"] = local_start
        return attrs

    def create(self, validated_data):
        validated_data.pop("date")
        validated_data.pop("time")
        starts_at = validated_data.pop("starts_at")
        return Reservation.objects.create(starts_at=starts_at, **validated_data)
