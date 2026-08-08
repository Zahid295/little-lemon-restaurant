import { render, screen } from "@testing-library/react";
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