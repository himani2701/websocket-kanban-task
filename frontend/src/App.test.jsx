import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('SyncBoard Logic Tests', () => {
  it('should add a new task to the TODO column', async () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText(/Enter new task title/i);
    const addButton = screen.getByText(/Add Task/i);

    // Simulate user typing and clicking
    fireEvent.change(input, { target: { value: 'Test Internship Task' } });
    fireEvent.click(addButton);

    // Verify task appears in the document
    expect(screen.getByText('Test Internship Task')).toBeDefined();
  });
});