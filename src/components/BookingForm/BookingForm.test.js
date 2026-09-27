import { render, screen, fireEvent } from "@testing-library/react";
import BookingForm from "./BookingForm";

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderBookingForm(formOverrides = {}) {
  const form = {
    date: "",
    time: "",
    guests: 1,
    occasion: "birthday",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    ...formOverrides,
  };

  return render(
    <BookingForm
      form={form}
      setForm={jest.fn()}
      updateDate={jest.fn()}
      updateGuests={jest.fn()}
      availableTimes={["17:00", "18:00"]}
      isLoadingTimes={false}
      availabilityError=""
      submissionError=""
      isSubmitting={false}
      submitReservation={jest.fn()}
    />
  );
}

test("renders Choose time and Number of guests labels", () => {
    renderBookingForm();

    const chooseTimeLabel = screen.getByTestId("choose-time-label");
    const guestsLabel = screen.getByTestId("guests-label");

    expect(chooseTimeLabel).toBeInTheDocument();
    expect(guestsLabel).toBeInTheDocument();
});

test("date input has required and min attributes", () => {
  renderBookingForm();

  const dateInput = screen.getByLabelText("Choose date");

  expect(dateInput).toBeRequired();
  expect(dateInput).toHaveAttribute("min", getDateString(new Date()));
});

test("time select is required", () => {
  renderBookingForm();

  const timeSelect = screen.getByLabelText("Choose time");
  expect(timeSelect).toBeRequired();
});

test("guests input has min and max constraints", () => {
  renderBookingForm();

  const guestsInput = screen.getByLabelText("Number of guests");

  expect(guestsInput).toHaveAttribute("min", "1");
  expect(guestsInput).toHaveAttribute("max", "10");
});

test("submit button is disabled when form is invalid", () => {
  renderBookingForm();

  const submitButton = screen.getByRole("button", { name: "Make your Reservation" });

  expect(submitButton).toBeDisabled();
});

test("submit button becomes enabled when form is valid", () => {
  renderBookingForm({
    date: getDateString(new Date(Date.now() + 24 * 60 * 60 * 1000)),
    time: "17:00",
    guests: 4,
    customer_name: "Ava Lemon",
    customer_email: "ava@example.com",
    customer_phone: "555-0100",
  });

  const submitButton = screen.getByRole("button", { name: "Make your Reservation" });

  expect(submitButton).toBeEnabled();
});