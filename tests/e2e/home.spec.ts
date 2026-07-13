import { test, expect } from "@playwright/test";

test("homepage renders the Squad Up heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /squad up/i })).toBeVisible();
});
