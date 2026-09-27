from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("littleLemonAPI", "0003_order_cart_orderitem"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="customer_name",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
        migrations.AddField(
            model_name="order",
            name="customer_email",
            field=models.EmailField(blank=True, default="", max_length=254),
        ),
        migrations.AddField(
            model_name="order",
            name="customer_phone",
            field=models.CharField(blank=True, default="", max_length=32),
        ),
        migrations.AddField(
            model_name="order",
            name="order_type",
            field=models.CharField(
                choices=[("pickup", "Pickup"), ("delivery", "Delivery")],
                default="pickup",
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="street",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
        migrations.AddField(
            model_name="order",
            name="city",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
        migrations.AddField(
            model_name="order",
            name="postcode",
            field=models.CharField(blank=True, default="", max_length=32),
        ),
    ]