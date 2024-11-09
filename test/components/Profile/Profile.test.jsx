import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { UserProvider, useUser } from "../../../src/user/UserContext";
import { store } from "../../store/store";
import StoreContext from "../../../src/store/storecontext";
import Profile from "../../../src/components/Profile/Profile";

vi.mock("../../../src/user/UserContext", () => ({
  useUser: vi.fn(),
}));

vi.mock(import("../../../src/store/storecontext"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    StoreContext: vi.fn(),
  };
});

describe("Profile Component", () => {
  const mockUser = {
    id: "user1",
    name: "John",
    surname: "Doe",
    email: "john.doe@example.com",
    isUserVerified: false,
    isEmailVerified: false,
    nroDni: "12345678",
    nroTramiteDni: "987654321",
    birthDate: new Date(1990, 1, 1).toISOString(),
    gender: "M",
    province: "Test Province",
    locality: "Test Locality",
  };

  const renderComponent = (userOverrides = {}, loading = false) => {
    useUser.mockReturnValue({
      user: { ...mockUser, ...userOverrides },
      setUser: vi.fn(),
      userDataLoading: loading,
    });
    return render(
      <StoreContext.Provider value={store}>
        <Profile />
      </StoreContext.Provider>
    );
  };
  afterEach(() => {
    cleanup();
  });
  it("shows loading indicator when data is loading", () => {
    renderComponent({}, true);
    //CircularProgress component
    expect(screen.getByRole("progressbar")).toBeDefined();
  });

  it("renders user's initials in Avatar", () => {
    renderComponent();
    const avatar = screen.getByText("JD");
    expect(avatar).toBeDefined();
  });

  it("displays user name, surname, and email correctly", () => {
    renderComponent();

    expect(screen.getByText("John Doe")).toBeDefined();
    expect(screen.getByText("Email:")).toBeDefined();
    expect(screen.getByText(mockUser.email)).toBeDefined();
  });

  it("displays warning and 'Verificar ahora' button when account is not verified", () => {
    renderComponent();
    expect(screen.getByText("Cuenta no verificada")).toBeDefined();
    const verifyButton = screen.getByRole("button", {
      name: /verificar ahora/i,
    });
    expect(verifyButton).toBeDefined();
  });

  it("displays CheckCircleIcon when account is verified", () => {
    renderComponent({ isUserVerified: true, isEmailVerified: true });
    expect(screen.getByLabelText("Validado")).toBeDefined();
  });

  it("displays CancelIcon when account is not verified", () => {
    renderComponent();
    expect(screen.getByLabelText("No validado")).toBeDefined();
  });

  it("displays VerificationSteps component when 'Verificar ahora' button is clicked", async () => {
    renderComponent();
    const verifyButton = await screen.getByRole("button", {
      name: /verificar ahora/i,
    });
    fireEvent.click(verifyButton);
    expect(await screen.getByText(/Pasos de verificacion/i)).toBeDefined();
  });

  it("shows success alert message after verification is successful", () => {
    renderComponent({}, false);
    fireEvent.click(screen.getByRole("button", { name: /verificar ahora/i }));
    expect(
      screen.getByText("Su cuenta ha sido verificada con exito")
    ).toBeDefined();
  });
});
