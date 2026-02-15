import { test, expect } from "@playwright/test";

test.describe("SyncBoard Professional E2E Suite", () => {
  
  test.beforeEach(async ({ page }) => {
    // Ensure this matches your Vite port (3000 as per your vite.config.js)
    await page.goto("http://localhost:3000"); 
  });

  test("User can add a task and verify persistence", async ({ page }) => {
    await expect(page.getByText("SyncBoard")).toBeVisible();

    const input = page.getByPlaceholder(/Enter new task title.../i);
    await input.fill("Internship Milestone");
    await page.click('button:has-text("Add Task")');

    // Verify task appears in TODO column
    const todoColumn = page.locator('.column:has-text("TO DO")');
    await expect(todoColumn.locator("text=Internship Milestone")).toBeVisible();
    
    // Verify Task Count updated
    await expect(todoColumn.locator(".task-count")).toHaveText("1");
  });

  test("User can drag a task from TODO to DONE and verify Chart update", async ({ page }) => {
    // 1 Setup: Add a task
    const input = page.getByPlaceholder(/Enter new task title.../i);
    await input.fill("Drag Test Task");
    await page.click('button:has-text("Add Task")');

    const taskCard = page.locator('.task-card:has-text("Drag Test Task")');
    const doneColumn = page.locator('.column:has-text("DONE")');

    // 2 Perform Drag and Drop
    // Note: Playwright's dragTo handles the complex pointer events required by dnd-kit
    await taskCard.dragTo(doneColumn);

    // 3 Verify Position Persistence
    await expect(doneColumn.locator("text=Drag Test Task")).toBeVisible();
    
    // 4 Verify Pie Chart Analytics (Integration Check)
    // Recharts uses SVG; we check for the existence of the sector
    const chartSector = page.locator(".recharts-pie-sector");
    await expect(chartSector).toBeVisible();
  });

  test("Delete button removes task and updates global state", async ({ page }) => {
    await page.fill('.task-input', "Cleanup Task");
    await page.click('button:has-text("Add Task")');

    const taskCard = page.locator('.task-card:has-text("Cleanup Task")');
    
    // Target the specific delete button inside the card
    // This verifies our pointer-event-propagation fix works
    await taskCard.locator('.delete-btn').click();

    await expect(page.locator("text=Cleanup Task")).not.toBeVisible();
  });
});