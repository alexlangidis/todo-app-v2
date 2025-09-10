import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import AppHeader from "./AppHeader";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("AppHeader", () => {
  const defaultProps = {
    isDarkMode: false,
    onToggleDarkMode: vi.fn(),
    onLogout: vi.fn(),
    userEmail: "test@example.com",
  };

  it("renders the app title", () => {
    renderWithRouter(<AppHeader {...defaultProps} />);
    expect(screen.getByText("To-Do App")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    renderWithRouter(<AppHeader {...defaultProps} />);
    expect(screen.getByText("Tasks")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
    expect(screen.getByText("Archive")).toBeInTheDocument();
  });

  it("renders user email when provided", () => {
    renderWithRouter(<AppHeader {...defaultProps} />);
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("renders logout button when onLogout is provided", () => {
    renderWithRouter(<AppHeader {...defaultProps} />);
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("renders dark mode toggle button", () => {
    renderWithRouter(<AppHeader {...defaultProps} />);
    const toggleButton = screen.getByLabelText("Toggle dark mode");
    expect(toggleButton).toBeInTheDocument();
  });
});
