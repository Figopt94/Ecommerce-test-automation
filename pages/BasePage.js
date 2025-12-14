export class BasePage {
    constructor(page) {
        this.page = page;
    }

    /**
     * Navigate to a specific URL
     * @param {string} url - URL to navigate to
     */
    async navigate(url) {
        await this.page.goto(url);
    }

    /**
     * Wait for element to be visible
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     */
    async waitForElement(selector, timeout = 5000) {
        await this.page.waitForSelector(selector, { 
            state: 'visible',
            timeout 
        });
    }

    /**
     * Get text content of element
     * @param {string} selector - Element selector
     * @returns {Promise<string>} Text content
     */
    async getText(selector) {
        return await this.page.textContent(selector);
    }

    /**
     * Check if element is visible
     * @param {string} selector - Element selector
     * @returns {Promise<boolean>} True if visible
     */
    async isVisible(selector) {
        return await this.page.isVisible(selector);
    }

    /**
     * Take screenshot
     * @param {string} name - Screenshot name
     */
    async takeScreenshot(name) {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        await this.page.screenshot({ 
            path: `screenshots/${name}-${timestamp}.png`,
            fullPage: true 
        });
    }

    /**
     * Get current URL
     * @returns {string} Current URL
     */
    getCurrentUrl() {
        return this.page.url();
    }

    /**
     * Wait for navigation
     */
    async waitForNavigation() {
        await this.page.waitForLoadState('networkidle');
    }
}