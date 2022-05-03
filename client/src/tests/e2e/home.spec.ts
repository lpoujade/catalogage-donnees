import { expect } from "@playwright/test";
import { STATE_AUTHENTICATED } from "./constants";
import { test } from "./fixtures";

test.describe("Catalog list", () => {
  test.use({ storageState: STATE_AUTHENTICATED });

  test("Visits the home page", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("Catalogue");

    await page
      .locator("data-test-id=Catalogue des enquêtes réalisées par la DARES")
      .first()
      .click();

    await page.locator("text='Modifier'").waitFor();
  });
});
