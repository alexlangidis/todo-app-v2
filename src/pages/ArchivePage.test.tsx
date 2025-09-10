import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import ArchivePage from "./ArchivePage";

// Mock the hooks
vi.mock("../hooks/useTasks", () => ({
  useTasks: () => ({
    archivedTasks: [
      {
        id: "1",
        text: "Test archived task",
        completed: false,
        createdAt: new Date(),
        deletedAt: new Date(),
        isArchived: true,
        category: "test-category",
        priority: "high",
        status: "pending",
      },
    ],
    loading: false,
    restoreTask: vi.fn(),
    permanentDeleteTask: vi.fn(),
  }),
}));

vi.mock("../hooks/useCategories", () => ({
  useCategories: () => ({
    categories: [
      { id: "test-category", label: "Test Category", color: "#ff0000" },
    ],
    loading: false,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ArchivePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the archive page title", () => {
    renderWithRouter(<ArchivePage />);
    expect(screen.getByText("Archived Tasks")).toBeInTheDocument();
  });

  it("displays archived tasks", () => {
    renderWithRouter(<ArchivePage />);
    expect(screen.getByText("Test archived task")).toBeInTheDocument();
  });

  it("shows archived date", () => {
    renderWithRouter(<ArchivePage />);
    expect(screen.getByText(/Archived:/)).toBeInTheDocument();
  });

  it("displays completion status", () => {
    renderWithRouter(<ArchivePage />);
    const statusSpans = screen.getAllByText("Incompleted");
    const taskStatusSpan = statusSpans.find((span) =>
      span.classList.contains("rounded-full")
    );
    expect(taskStatusSpan).toBeInTheDocument();
    expect(taskStatusSpan?.tagName).toBe("SPAN");
  });

  it("shows quick action buttons", () => {
    renderWithRouter(<ArchivePage />);
    expect(screen.getByTitle("View Details")).toBeInTheDocument();
    expect(screen.getByTitle("Restore Task")).toBeInTheDocument();
    expect(screen.getByTitle("Delete Permanently")).toBeInTheDocument();
  });

  it("has search input", () => {
    renderWithRouter(<ArchivePage />);
    const searchInput = screen.getByPlaceholderText(
      "Search by task content or ID..."
    );
    expect(searchInput).toBeInTheDocument();
  });

  it("has filter dropdowns", () => {
    renderWithRouter(<ArchivePage />);
    expect(screen.getByDisplayValue("All Categories")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Filter by archived date")
    ).toBeInTheDocument();
  });

  it("shows statistics", () => {
    renderWithRouter(<ArchivePage />);
    expect(screen.getByText("Total Archived")).toBeInTheDocument();
    expect(screen.getByText("Filtered Results")).toBeInTheDocument();
  });

  it("has select all button", () => {
    renderWithRouter(<ArchivePage />);
    expect(screen.getByText("Select All (1)")).toBeInTheDocument();
  });
});
