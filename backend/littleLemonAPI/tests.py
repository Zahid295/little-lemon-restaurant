from datetime import timedelta
from zoneinfo import ZoneInfo

from django.conf import settings
from django.utils import timezone
from rest_framework.test import APITestCase

from .models import Reservation


class ReservationAPITests(APITestCase):
	def setUp(self):
		restaurant_timezone = ZoneInfo(settings.RESTAURANT_TIME_ZONE)
		self.date = (
			timezone.now().astimezone(restaurant_timezone).date() + timedelta(days=1)
		).isoformat()
		self.booking_data = {
			"customer_name": "Ava Lemon",
			"customer_email": "ava@example.com",
			"customer_phone": "555-0100",
			"date": self.date,
			"time": "17:00",
			"guests": 10,
			"occasion": "birthday",
		}

	def create_reservation(self, data=None):
		return self.client.post(
			"/api/reservations",
			data or self.booking_data,
			format="json",
		)

	def test_availability_returns_future_slots_for_party_size(self):
		response = self.client.get(
			"/api/reservations/availability",
			{"date": self.date, "guests": 10},
		)

		self.assertEqual(response.status_code, 200)
		self.assertIn("17:00", response.data["available_times"])
		self.assertIn("22:30", response.data["available_times"])
		self.assertNotIn("23:00", response.data["available_times"])

	def test_capacity_is_enforced_and_cancellation_releases_it(self):
		first_response = self.create_reservation()
		second_response = self.create_reservation()

		self.assertEqual(first_response.status_code, 201)
		self.assertEqual(second_response.status_code, 201)
		self.assertEqual(self.create_reservation().status_code, 409)
		self.assertNotIn(
			"17:00",
			self.client.get(
				"/api/reservations/availability",
				{"date": self.date, "guests": 1},
			).data["available_times"],
		)

		cancel_response = self.client.post(
			f"/api/reservations/{first_response.data['confirmation_code']}/cancel"
		)

		self.assertEqual(cancel_response.status_code, 200)
		self.assertEqual(cancel_response.data["status"], "cancelled")
		available_response = self.client.get(
			"/api/reservations/availability",
			{"date": self.date, "guests": 10},
		)
		self.assertIn("17:00", available_response.data["available_times"])
		self.assertEqual(Reservation.objects.count(), 2)

	def test_closed_slot_is_rejected_without_creating_reservation(self):
		invalid_booking = {**self.booking_data, "time": "23:00"}

		response = self.create_reservation(invalid_booking)

		self.assertEqual(response.status_code, 400)
		self.assertEqual(Reservation.objects.count(), 0)
