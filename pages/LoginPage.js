import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Locators
        this.usernameInput = '#user-name';
        this.passwordInput = '#password';
        this.loginButton = '#login-button';
        this.errorMessage = '[data-test="error"]';
        this.errorButton = '.error-button';
    }

    /**
     * Navigate to login page
     */
    async goto() {
        await this.navigate('/');
    }

    /**
     * Login with credentials
     * @param {string} username - Username
     * @param {string} password - Password
     */
    async login(username, password) {
        await this.page.fill(this.usernameInput, username);
        await this.page.fill(this.passwordInput, password);
        await this.page.click(this.loginButton);
    }

    /**
     * Get error message text
     * @returns {Promise<string>} Error message
     */
    async getErrorMessage() {
        await this.waitForElement(this.errorMessage);
        return await this.getText(this.errorMessage);
    }

    /**
     * Check if error message is displayed
     * @returns {Promise<boolean>} True if error visible
     */
    async isErrorDisplayed() {
        return await this.isVisible(this.errorMessage);
    }

    /**
     * Check if login was successful
     * @returns {Promise<boolean>} True if on inventory page
     */
    async isLoginSuccessful() {
        await this.page.waitForURL('**/inventory.html', { timeout: 5000 });
        return this.getCurrentUrl().includes('inventory');
    }

    /**
     * Clear error message
     */
    async clearError() {
        if (await this.isVisible(this.errorButton)) {
            await this.page.click(this.errorButton);
        }
    }
}