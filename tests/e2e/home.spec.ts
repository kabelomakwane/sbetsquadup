import { test, expect } from "@playwright/test";

test("age check confirms and lands on the Landing Page", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /confirm you are over 18/i }),
  ).toBeVisible();

  await page.getByRole("button", { name: /yes, i'm over 18/i }).click();

  await expect(page).toHaveURL(/\/landing$/);
  await expect(page.getByAltText("SBET Squad Up")).toBeVisible();
});
