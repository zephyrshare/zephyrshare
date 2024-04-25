import { test, expect } from '@playwright/test';

test('log in as zonalexchange user', async ({ page }) => {
  // Navigate to the login page
  await page.goto('http://localhost:3000/login');

  // Fill in the credentials
  await page.fill('input[name="username"]', 'zonalexchange');
  await page.fill('input[name="password"]', 'zonalpass');

  // Click the submit button. Adjust the selector as per your actual login form.
  await page.click('button[name="submit-credentials"]');

  // Wait 5 seconds for the login to complete. Adjust the time as per your application's performance.
  await page.waitForTimeout(5000);

  // Add assertions to verify successful login, such as checking for a specific element that's only visible when logged in
  // For example, if a successful login redirects to a dashboard page, check for a dashboard-specific element
  await expect(page.url()).toContain('/owner/marketdata'); // Adjust the URL path as per your application's flow

  // Further actions or checks can be added here, such as verifying the user's presence in the database if accessible via the UI
});
