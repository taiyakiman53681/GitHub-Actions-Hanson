const { test, expect } = require("@playwright/test");

test("task dashboard is visible", async ({ page }) => {
  await page.goto("/ui");

  await expect(page.getByRole("heading", { name: "Docker Lab" })).toBeVisible();
  await expect(page.getByText("DockerとTerraformを勉強する")).toBeVisible();
  await expect(page.getByText("Playwright demo")).toBeVisible();
});
