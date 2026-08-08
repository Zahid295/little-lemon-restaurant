import { initializeTimes } from "./Reservations";
import { updateTimes } from "./Reservations";

test("initializeTimes returns the correct initial state", () => {
    const result = initializeTimes();

    expect(result).toEqual({
        available: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
        booked: {}
    });
});

test("updateTimes returns the same state for the unknown action", () => {
    const state = {
        available: ["17:00", "18:00"],
        booked: {}
    };

    const action = {type: "unknown"};
    const result = updateTimes(state, action);

    expect(result).toEqual(state);
});