import { expect } from "@playwright/test";
import { STATE_AUTHENTICATED } from "./constants";
import { test } from "./fixtures";

test.describe("Catalog list", () => {
  test.use({ storageState: STATE_AUTHENTICATED });

  test("Visits the home page", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("Catalogue");

    await page
      .locator("title=Consulter cette fiche de données")
      .first()
      .click();

    await page.locator("text='Modifier'").waitFor();
  });
});
