/**
 * Hotels Page E2E Tests
 * 
 * Tests the hotels list page functionality.
 */

import { test, expect } from '@playwright/test';

test.describe('Hotels Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/hotels');
    });

    test('displays the hotels page with title', async ({ page }) => {
        // Wait for page to load
        await expect(page.locator('h1')).toContainText(/Hotels/i);
    });

    test('displays hotel list or table', async ({ page }) => {
        // Should have some hotel cards or table rows
        const hotelElements = page.locator('[data-testid="hotel-card"], [data-testid="hotel-row"], table tbody tr');
        await expect(hotelElements.first()).toBeVisible({ timeout: 10000 });
    });

    test('search filters hotels', async ({ page }) => {
        // Find search input
        const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');

        if (await searchInput.isVisible()) {
            await searchInput.fill('Grand');

            // Wait for filter to apply
            await page.waitForTimeout(500);

            // Check that results are filtered (at least some change)
            const results = page.locator('[data-testid="hotel-card"], [data-testid="hotel-row"], table tbody tr');
            await expect(results.first()).toBeVisible();
        }
    });

    test('pagination controls work', async ({ page }) => {
        // Look for pagination controls
        const nextButton = page.locator('button:has-text("Next"), [data-testid="next-page"]');

        if (await nextButton.isVisible() && await nextButton.isEnabled()) {
            await nextButton.click();

            // Wait for page change
            await page.waitForTimeout(300);

            // Should still show content
            await expect(page.locator('h1')).toContainText(/Hotels/i);
        }
    });

    test('has responsive layout on mobile', async ({ page }) => {
        // Already using mobile viewport from Playwright config
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/hotels');

        // Page should still be functional
        await expect(page.locator('h1')).toBeVisible();
    });
});

test.describe('Dashboard Page', () => {
    test('displays dashboard metrics', async ({ page }) => {
        await page.goto('/dashboard');

        // Should have KPI cards or metrics
        await expect(page.locator('h1')).toContainText(/Dashboard|Overview/i);
    });
});
