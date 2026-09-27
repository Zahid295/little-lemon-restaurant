import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("littleLemonAPI", "0004_order_checkout_details"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="ReservationSlot",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("starts_at", models.DateTimeField(unique=True)),
                ("reserved_guests", models.PositiveSmallIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name="Reservation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "confirmation_code",
                    models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
                ),
                ("customer_name", models.CharField(max_length=255)),
                ("customer_email", models.EmailField(max_length=254)),
                ("customer_phone", models.CharField(max_length=32)),
                ("starts_at", models.DateTimeField(db_index=True)),
                ("guests", models.PositiveSmallIntegerField()),
                (
                    "occasion",
                    models.CharField(
                        choices=[
                            ("birthday", "Birthday"),
                            ("anniversary", "Anniversary"),
                            ("other", "Other"),
                        ],
                        default="other",
                        max_length=16,
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[("confirmed", "Confirmed"), ("cancelled", "Cancelled")],
                        default="confirmed",
                        max_length=10,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="reservations",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={"ordering": ["starts_at"]},
        ),
    ]