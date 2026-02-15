import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../../src/App"; // Test from App level to catch integration
import { io } from "socket.io-client";

//  Mock the socket.io-client library
vi.mock("socket.io-client", () => {
  const mSocket = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  };
  return { io: vi.fn(() => mSocket) };
});

describe("WebSocket & Kanban Integration", () => {
  let mockSocket;

  beforeEach(() => {
    mockSocket = io();
  });

  it("should display 'Real-time Sync Active' status in the header", () => {
    render(<App />);
    const statusText = screen.getByText(/Real-time Sync Active/i);
    expect(statusText).toBeInTheDocument();
  });

  it("should update the board when a 'tasks_updated' event is received", async () => {
    render(<App />);

    // Get the function that handles 'tasks_updated'
    const updateHandler = mockSocket.on.mock.calls.find(
      (call) => call[0] === "tasks_updated"
    )[1];

    // Simulate an incoming WebSocket message with a new task
    const remoteTask = [{ id: "remote-1", title: "Remote Task", status: "todo" }];
    
    await act(async () => {
      updateHandler(remoteTask);
    });

    // Verify the UI updated with data from the "server"
    expect(screen.getByText("Remote Task")).toBeInTheDocument();
  });

  it("should emit 'update_tasks' when a local task is added", () => {
    render(<App />);
    
    // Simulate adding a task via UI
    const input = screen.getByPlaceholderText(/Enter new task title/i);
    const addButton = screen.getByText(/Add Task/i);

    fireEvent.change(input, { target: { value: 'Local Sync Test' } });
    fireEvent.click(addButton);

    // Verify socket.emit was called to broadcast the change
    expect(mockSocket.emit).toHaveBeenCalledWith("update_tasks", expect.any(Array));
  });
});