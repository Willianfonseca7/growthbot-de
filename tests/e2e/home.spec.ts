import { expect, test } from "@playwright/test";

test("renders the GrowthBot DE dashboard shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "LLM sales orchestration with a real operator dashboard." })).toBeVisible();
  await expect(page.getByText("GrowthBot DE Platform")).toBeVisible();
  await expect(page.getByText("Platform Architecture")).toBeVisible();
});
