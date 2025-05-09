import { test, expect, Page } from '@playwright/test';

class AdvocatesPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/");
    await expect(this.page.getByText("Solace Advocates")).toBeVisible();
  }

  async getAdvocateRowByText(text: string) {
    return this.page.locator('tr', {has: this.page.getByText(text)}).first();
  }

  async searchAdvocates(text: string) {
    return this.page.getByRole("searchbox").fill(text);
  }

  async resetSearch() {
    return this.page.getByText('Reset Search').click();
  }

  async getAllRows() {
    return this.page.locator('tr');
  }
}

test('viewing advocates', async ({ page }) => {
  const advocatesPage = new AdvocatesPage(page);
  await advocatesPage.goto();

  // verify all relevant information is present
  const johnDoeRow = await advocatesPage.getAdvocateRowByText('John');
  const janeDoeRow = await advocatesPage.getAdvocateRowByText('Jane');

  await expect(johnDoeRow).toBeVisible();
  await expect(janeDoeRow).toBeVisible();

  await expect(johnDoeRow.getByText("Doe")).toBeVisible();
  await expect(johnDoeRow.getByText("New York")).toBeVisible();
  await expect(johnDoeRow.getByText("Suicide History/Attempts")).toBeVisible();
  await expect(johnDoeRow.getByText("Personality disorders")).toBeVisible();
  await expect(johnDoeRow.getByText("10")).toBeVisible();
  await expect(johnDoeRow.getByText("5551234567")).toBeVisible();
});

test('filtering advocates', async ({ page }) => {
  const advocatesPage = new AdvocatesPage(page);
  await advocatesPage.goto();

  // verify all relevant information is present
  let johnDoeRow = await advocatesPage.getAdvocateRowByText('John');
  let janeDoeRow = await advocatesPage.getAdvocateRowByText('Jane');

  await expect(johnDoeRow).toBeVisible();
  await expect(janeDoeRow).toBeVisible();

  await advocatesPage.searchAdvocates('Jane');

  johnDoeRow = await advocatesPage.getAdvocateRowByText('John');
  janeDoeRow = await advocatesPage.getAdvocateRowByText('Jane');

  await expect(johnDoeRow).not.toBeVisible();
  await expect(janeDoeRow).toBeVisible();

});

test('filtering advocates is case insensitive', async ({ page }) => {
  const advocatesPage = new AdvocatesPage(page);
  await advocatesPage.goto();

  // verify all relevant information is present
  let johnDoeRow = await advocatesPage.getAdvocateRowByText('John');
  let janeDoeRow = await advocatesPage.getAdvocateRowByText('Jane');

  await expect(johnDoeRow).toBeVisible();
  await expect(janeDoeRow).toBeVisible();

  await advocatesPage.searchAdvocates('jane');

  johnDoeRow = await advocatesPage.getAdvocateRowByText('John');
  janeDoeRow = await advocatesPage.getAdvocateRowByText('Jane');

  await expect(johnDoeRow).not.toBeVisible();
  await expect(janeDoeRow).toBeVisible();
});

test('resetting the filter', async ({page}) => {
  const advocatesPage = new AdvocatesPage(page);
  await advocatesPage.goto();

  await advocatesPage.searchAdvocates('Nonsense Value That Wont Show Up');
  await expect(await advocatesPage.getAllRows()).not.toBeVisible();

  await advocatesPage.resetSearch();
  await expect(await advocatesPage.getAdvocateRowByText('John')).toBeVisible();
});