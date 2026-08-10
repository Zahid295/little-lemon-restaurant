import { initializeTimes } from "./Reservations";
import { updateTimes } from "./Reservations";

test("initializeTimes returns the available times from fetchAPI", () => {
    const mockTimes = ["17:00", "18:00", "19:00"]
    global.fetchAPI = jest.fn(() => mockTimes)
    const result = initializeTimes();

    expect(result).toEqual(mockTimes);
    expect(fetchAPI).toHaveBeenCalled();
});

test("updateTimes updates available times based on the selected date", () => {
    const mockTimes = ["17:00", "18:00"];
    const selectedDate = new Date("2026-08-11");

    global.fetchAPI = jest.fn(() => mockTimes);
    const state = ["16:00"];
    const action = { type: "update-times", payload: selectedDate };

    const result = updateTimes(state, action);

    expect(result).toEqual(mockTimes);
    expect(fetchAPI).toHaveBeenCalledWith(selectedDate);
});