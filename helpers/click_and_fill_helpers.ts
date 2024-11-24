import { type Page } from "@playwright/test";


/**
 * Method to click on the button by its visible text.
 * 
 * @param page 
 * @param buttonText 
 */
async function clickButton(page: Page, buttonText: string): Promise<void> {
  await page.getByRole('button', { name: buttonText }).click()
}

/**
 * Method to type text in the input found by its placeholder
 * @param page 
 * @param linkText 
 * @param text 
 */
async function typeText(page: Page, placeholderText: string, text: string): Promise<void> {
  await page.getByPlaceholder(placeholderText).fill(text);
}

export { clickButton, typeText }