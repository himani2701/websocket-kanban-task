
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from '../../src/components/TaskCard';

describe('TaskCard Component', () => {
  const mockTask = { id: '1', title: 'Test Task', status: 'todo' };
  const mockDelete = vi.fn();

  it('renders task title correctly', () => {
    render(<TaskCard task={mockTask} onDelete={mockDelete} />);
    expect(screen.getByText('Test Task')).toBeDefined();
  });

  it('calls onDelete when trash icon is clicked', () => {
    render(<TaskCard task={mockTask} onDelete={mockDelete} />);
    const deleteBtn = screen.getByRole('button');
    fireEvent.click(deleteBtn);
    expect(mockDelete).toHaveBeenCalledWith('1');
  });
});