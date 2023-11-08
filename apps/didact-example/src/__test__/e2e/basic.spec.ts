import { test, expect } from "@playwright/test";

test("the Hello h1 renders", async ({ page }) => {
  await page.goto("/");

  const hello = page.getByText("Hello");
  await expect(hello).toBeVisible();
});

test("can increment count", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /Count/i });
  await button.click();

  expect(await button.textContent()).toBe("Count: 2");
});
