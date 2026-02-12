import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import KanbanBoard from "../../components/KanbanBoard.jsx";
import React from "react";


vi.mock("../../hooks/useSocket", () => ({
  useSocket: () => ({
    tasks: [
      { id: "1", title: "Pro Task", status: "To Do", priority: "High", category: "Bug", attachments: [] }
    ],
    createTask: vi.fn(),
    updateTask: vi.fn(),
    moveTask: vi.fn(),
    deleteTask: vi.fn(),
  }),
}));

describe("KanbanBoard Unit Tests", () => {
  it("renders the updated Kanban board title", () => {
    render(<KanbanBoard />);
    // Updated to match the "Real-Time Kanban" header we added
    expect(screen.getByText(/Real-Time Kanban/i)).toBeInTheDocument();
  });

  it("displays all three Kanban columns", () => {
    render(<KanbanBoard />);
    expect(screen.getByText("TO DO")).toBeInTheDocument();
    expect(screen.getByText("IN PROGRESS")).toBeInTheDocument();
    expect(screen.getByText("DONE")).toBeInTheDocument();
  });

  it("renders tasks provided by the socket hook", () => {
    render(<KanbanBoard />);
    expect(screen.getByText("Pro Task")).toBeInTheDocument();
  });

  it("handles user input in the task creation field", () => {
    render(<KanbanBoard />);
    const input = screen.getByPlaceholderText(/Enter new task title.../i);
    fireEvent.change(input, { target: { value: "Finish Internship Task" } });
    expect(input.value).toBe("Finish Internship Task");
  });
});