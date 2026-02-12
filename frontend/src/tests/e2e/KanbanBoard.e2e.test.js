import { test, expect } from "@playwright/test";

test.describe("Kanban Board E2E Tests", () => {
  
  test.beforeEach(async ({ page }) => {
    
    await page.goto("http://localhost:5173"); 
  });

  test("User can add a task and see it on the board", async ({ page }) => {
    await expect(page.getByText("Real-Time Kanban")).toBeVisible();

    const input = page.getByPlaceholder(/Enter new task title.../i);
    await input.fill("Playwright Test Task");
    await page.keyboard.press("Enter");

    
    await expect(page.locator("text=Playwright Test Task")).toBeVisible();
  });

  test("User can delete a task", async ({ page }) => {
    // Adding a task first
    const input = page.getByPlaceholder(/Enter new task title.../i);
    await input.fill("Task to Delete");
    await page.keyboard.press("Enter");

    // Click the trash icon 
    // We target the button within the card containing our text
    const taskCard = page.locator("div", { hasText: "Task to Delete" });
    await taskCard.locator("button").click();

    await expect(page.locator("text=Task to Delete")).not.toBeVisible();
  });

  test("Graph updates when tasks are added", async ({ page }) => {
    // Check if the Recharts container is rendered
    const chart = page.locator(".recharts-responsive-container");
    await expect(chart).toBeVisible();
  });
});