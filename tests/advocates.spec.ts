import { test, expect } from '@playwright/test';

test('viewing advocates', async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Solace Advocates")).toBeVisible();
  await expect(page.getByText("John").first()).toBeVisible();
  await expect(page.getByText("Jane").first()).toBeVisible();

  // verify all relevant information is present
  const johnDoeRow = await page.locator('tr').first();

  await expect(johnDoeRow).toBeVisible();
  await expect(johnDoeRow.getByText("Doe")).toBeVisible();
  await expect(johnDoeRow.getByText("New York")).toBeVisible();
  await expect(johnDoeRow.getByText("Suicide History/Attempts")).toBeVisible();
  await expect(johnDoeRow.getByText("Personality disorders")).toBeVisible();
  await expect(johnDoeRow.getByText("10")).toBeVisible();
  await expect(johnDoeRow.getByText("5551234567")).toBeVisible();
});