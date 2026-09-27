from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.db.models import F
from django.utils import timezone

from .models import ReservationSlot


def get_reservation_slot_starts(reservation_date):
    restaurant_timezone = ZoneInfo(settings.RESTAURANT_TIME_ZONE)
    opens_at = time.fromisoformat(settings.RESERVATION_OPEN_TIME)
    closes_at = time.fromisoformat(settings.RESERVATION_CLOSE_TIME)
    slot_duration = timedelta(minutes=settings.RESERVATION_SLOT_MINUTES)
    current_start = datetime.combine(reservation_date, opens_at)
    closing_time = datetime.combine(reservation_date, closes_at)
    current_time = timezone.now().astimezone(restaurant_timezone)
    starts = []

    if slot_duration <= timedelta(0):
        raise ImproperlyConfigured("RESERVATION_SLOT_MINUTES must be positive.")
    if closes_at <= opens_at:
        raise ImproperlyConfigured("RESERVATION_CLOSE_TIME must be later than RESERVATION_OPEN_TIME.")
    if settings.RESERVATION_SLOT_CAPACITY <= 0:
        raise ImproperlyConfigured("RESERVATION_SLOT_CAPACITY must be positive.")

    while current_start + slot_duration <= closing_time:
        aware_start = current_start.replace(tzinfo=restaurant_timezone)
        if aware_start > current_time:
            starts.append(aware_start)
        current_start += slot_duration

    return starts


def reserve_slot(starts_at, guests):
    slot, _ = ReservationSlot.objects.get_or_create(starts_at=starts_at)
    capacity = settings.RESERVATION_SLOT_CAPACITY
    if guests > capacity:
        return False

    return bool(
        ReservationSlot.objects.filter(
            pk=slot.pk,
            reserved_guests__lte=capacity - guests,
        ).update(reserved_guests=F("reserved_guests") + guests)
    )


def release_slot(starts_at, guests):
    slot, _ = ReservationSlot.objects.get_or_create(starts_at=starts_at)
    return bool(
        ReservationSlot.objects.filter(
            pk=slot.pk,
            reserved_guests__gte=guests,
        ).update(reserved_guests=F("reserved_guests") - guests)
    )