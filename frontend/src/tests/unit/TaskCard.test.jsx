import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskCard from "../../components/TaskCard.jsx";
import React from "react";

describe("TaskCard Component", () => {
  const mockTask = {
    id: "123",
    title: "Test Feature",
    priority: "Medium",
    category: "Feature",
    attachments: []
  };

  it("renders task details correctly", () => {
    render(<TaskCard task={mockTask} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Test Feature")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Medium")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Feature")).toBeInTheDocument();
  });
}); 