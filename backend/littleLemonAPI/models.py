# Create your models here.

import uuid

from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

class Category(models.Model):
    slug = models.SlugField()
    title = models.CharField(max_length=255, db_index=True)

    def __str__(self):
        return self.title


class MenuItem(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, db_index=True)
    featured = models.BooleanField(db_index=True)
    description = models.TextField(blank=True)
    image = models.URLField(blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="menu_items"
    )

    def __str__(self):
        return self.title


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    menuitem = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.SmallIntegerField()
    unit_price = models.DecimalField(max_digits=6, decimal_places=2)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        unique_together = ('menuitem', 'user')


class Order(models.Model):
    ORDER_TYPE_CHOICES = [
        ("pickup", "Pickup"),
        ("delivery", "Delivery"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    delivery_crew = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="delivery_crew", null=True)
    status = models.BooleanField(db_index=True, default=0)
    total = models.DecimalField(max_digits=6, decimal_places=2)
    date = models.DateField(db_index=True)
    customer_name = models.CharField(max_length=255, blank=True, default="")
    customer_email = models.EmailField(blank=True, default="")
    customer_phone = models.CharField(max_length=32, blank=True, default="")
    order_type = models.CharField(max_length=10, choices=ORDER_TYPE_CHOICES, default="pickup")
    street = models.CharField(max_length=255, blank=True, default="")
    city = models.CharField(max_length=255, blank=True, default="")
    postcode = models.CharField(max_length=32, blank=True, default="")

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    menuitem = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.SmallIntegerField()
    unit_price = models.DecimalField(max_digits=6, decimal_places=2)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        unique_together = ("order", "menuitem")


class ReservationSlot(models.Model):
    starts_at = models.DateTimeField(unique=True)
    reserved_guests = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return self.starts_at.isoformat()


class Reservation(models.Model):
    STATUS_CHOICES = [
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
    ]
    OCCASION_CHOICES = [
        ("birthday", "Birthday"),
        ("anniversary", "Anniversary"),
        ("other", "Other"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reservations",
    )
    confirmation_code = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=32)
    starts_at = models.DateTimeField(db_index=True)
    guests = models.PositiveSmallIntegerField()
    occasion = models.CharField(max_length=16, choices=OCCASION_CHOICES, default="other")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="confirmed")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["starts_at"]

    def __str__(self):
        return f"{self.customer_name} - {self.starts_at.isoformat()}"

