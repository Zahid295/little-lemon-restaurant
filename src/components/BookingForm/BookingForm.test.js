import { render, screen, fireEvent } from "@testing-library/react";
import BookingForm from "./BookingForm";

test("renders Choose time and Number of guests labels", () => {
    const mockDispatch = () => {};

    render(
        <BookingForm
        availableTimes={["17:00", "18:00"]}
        dispatch={mockDispatch}
        />
    );

    const chooseTimeLabel = screen.getByTestId("choose-time-label");
    const guestsLabel = screen.getByTestId("guests-label");

    expect(chooseTimeLabel).toBeInTheDocument();
    expect(guestsLabel).toBeInTheDocument();
});

test("date input has required and min attributes", () => {
  const mockDispatch = jest.fn();
  const mockSubmit = jest.fn();

  render(
    <BookingForm
      availableTimes={["17:00", "18:00"]}
      dispatch={mockDispatch}
      submitForm={mockSubmit}
    />
  );

  const dateInput = screen.getByLabelText("Choose date");

  expect(dateInput).toBeRequired();
  expect(dateInput).toHaveAttribute(
    "min",
    new Date().toISOString().split("T")[0]
  );
});

test("time select is required", () => {
  const mockDispatch = jest.fn();
  const mockSubmit = jest.fn();

  render(
    <BookingForm
      availableTimes={["17:00", "18:00"]}
      dispatch={mockDispatch}
      submitForm={mockSubmit}
    />
  );

  const timeSelect = screen.getByLabelText("Choose time");
  expect(timeSelect).toBeRequired();
});

test("guests input has min and max constraints", () => {
  const mockDispatch = jest.fn();
  const mockSubmit = jest.fn();

  render(
    <BookingForm
      availableTimes={["17:00", "18:00"]}
      dispatch={mockDispatch}
      submitForm={mockSubmit}
    />
  );

  const guestsInput = screen.getByLabelText("Number of guests");

  expect(guestsInput).toHaveAttribute("min", "1");
  expect(guestsInput).toHaveAttribute("max", "10");
});

test("submit button is disabled when form is invalid", () => {
  const mockDispatch = jest.fn();
  const mockSubmit = jest.fn();

  render(
    <BookingForm
      availableTimes={["17:00", "18:00"]}
      dispatch={mockDispatch}
      submitForm={mockSubmit}
    />
  );

  const submitButton = screen.getByTestId("submit-button");

  expect(submitButton).toBeDisabled();
});

test("submit button becomes enabled when form is valid", () => {
  const mockDispatch = jest.fn();
  const mockSubmit = jest.fn();

  render(
    <BookingForm
      availableTimes={["17:00", "18:00"]}
      dispatch={mockDispatch}
      submitForm={mockSubmit}
    />
  );

  const dateInput = screen.getByLabelText("Choose date");
  const timeSelect = screen.getByLabelText("Choose time");
  const guestsInput = screen.getByLabelText("Number of guests");
  const submitButton = screen.getByTestId("submit-button");

  fireEvent.change(dateInput, { target: { value: "2026-08-10" } });
  fireEvent.change(timeSelect, { target: { value: "17:00" } });
  fireEvent.change(guestsInput, { target: { value: "4" } });

  expect(submitButton).toBeEnabled();
});