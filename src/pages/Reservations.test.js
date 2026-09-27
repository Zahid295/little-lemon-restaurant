import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Reservations from "./Reservations";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

function renderReservations() {
    return render(<Reservations />);
}

afterEach(() => {
    jest.resetAllMocks();
    mockNavigate.mockReset();
});

test("loads available times from the backend for the selected date and party size", async () => {
    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ available_times: ["17:00", "17:30"] }),
    });

    renderReservations();

    expect(await screen.findByRole("option", { name: "17:00" })).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/reservations\/availability\?date=\d{4}-\d{2}-\d{2}&guests=1/),
        expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
});

test("submits the reservation and routes to its saved confirmation", async () => {
    const confirmationCode = "b1d9a5d4-3c55-4b16-92cb-6e887daf21b1";
    global.fetch = jest.fn((url, options = {}) => {
        if (String(url).includes("/availability")) {
            return Promise.resolve({
                ok: true,
                json: async () => ({ available_times: ["17:00"] }),
            });
        }
        return Promise.resolve({
            ok: true,
            json: async () => ({ confirmation_code: confirmationCode }),
        });
    });

    renderReservations();
    fireEvent.change(await screen.findByLabelText("Full name"), {
        target: { value: "Ava Lemon" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "ava@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Phone"), {
        target: { value: "555-0100" },
    });
    fireEvent.change(screen.getByLabelText("Choose time"), {
        target: { value: "17:00" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Make your Reservation" }));

    await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith(`/confirmed/${confirmationCode}`)
    );
    await waitFor(() =>
        expect(global.fetch).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/api/reservations",
            expect.objectContaining({
                method: "POST",
                body: expect.stringContaining('"customer_name":"Ava Lemon"'),
            })
        )
    );
});