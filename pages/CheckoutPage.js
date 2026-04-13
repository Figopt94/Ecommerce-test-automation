import { BasePage } from './BasePage.js';

export class CheckoutPage extends BasePage {
    constructor(page) {
        super(page);

        // Step One - Shipping Info
        this.firstNameInput = '#first-name';
        this.lastNameInput = '#last-name';
        this.zipCodeInput = '#postal-code';
        this.continueButton = '#continue';
        this.cancelButton = '#cancel';
        this.errorMessage = '[data-test="error"]';

        // Step Two - Overview
        this.overviewContainer = '.checkout_summary_container';
        this.cartItem = '.cart_item';
        this.cartItemName = '.inventory_item_name';
        this.subtotalLabel = '.summary_subtotal_label';
        this.taxLabel = '.summary_tax_label';
        this.totalLabel = '.summary_total_label';
        this.finishButton = '#finish';

        // Complete
        this.confirmationHeader = '.complete-header';
        this.confirmationText = '.complete-text';
        this.backHomeButton = '#back-to-products';
    }

    /**
     * Check if on checkout step one
     * @returns {Promise<boolean>}
     */
    async isOnStepOne() {
        try {
            await this.page.waitForURL('**/checkout-step-one.html', { timeout: 5000 });
            return this.getCurrentUrl().includes('checkout-step-one.html');
        } catch {
            return false;
        }
    }

    /**
     * Check if on checkout step two (order overview)
     * @returns {Promise<boolean>}
     */
    async isOnStepTwo() {
        try {
            await this.page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });
            return this.getCurrentUrl().includes('checkout-step-two.html');
        } catch {
            return false;
        }
    }

    /**
     * Check if on checkout complete page
     * @returns {Promise<boolean>}
     */
    async isOrderComplete() {
        try {
            await this.page.waitForURL('**/checkout-complete.html', { timeout: 5000 });
            return this.getCurrentUrl().includes('checkout-complete.html');
        } catch {
            return false;
        }
    }

    /**
     * Fill shipping information and continue
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} zipCode
     */
    async fillShippingInfo(firstName, lastName, zipCode) {
        await this.page.fill(this.firstNameInput, firstName);
        await this.page.fill(this.lastNameInput, lastName);
        await this.page.fill(this.zipCodeInput, zipCode);
        await this.page.click(this.continueButton);
    }

    /**
     * Get error message from step one
     * @returns {Promise<string>}
     */
    async getErrorMessage() {
        await this.waitForElement(this.errorMessage);
        return await this.getText(this.errorMessage);
    }

    /**
     * Check if error is displayed
     * @returns {Promise<boolean>}
     */
    async isErrorDisplayed() {
        return await this.isVisible(this.errorMessage);
    }

    /**
     * Cancel and go back
     */
    async cancel() {
        await this.page.click(this.cancelButton);
    }

    /**
     * Get all item names in order overview
     * @returns {Promise<string[]>}
     */
    async getOverviewItemNames() {
        await this.waitForElement(this.overviewContainer);
        const elements = await this.page.locator(this.cartItemName).all();
        return await Promise.all(elements.map(el => el.textContent()));
    }

    /**
     * Get subtotal value (without tax)
     * @returns {Promise<string>}
     */
    async getSubtotal() {
        return await this.getText(this.subtotalLabel);
    }

    /**
     * Get tax value
     * @returns {Promise<string>}
     */
    async getTax() {
        return await this.getText(this.taxLabel);
    }

    /**
     * Get total price (with tax)
     * @returns {Promise<string>}
     */
    async getTotal() {
        return await this.getText(this.totalLabel);
    }

    /**
     * Finish the order
     */
    async finishOrder() {
        await this.page.click(this.finishButton);
        await this.page.waitForURL('**/checkout-complete.html');
    }

    /**
     * Get confirmation header message
     * @returns {Promise<string>}
     */
    async getConfirmationHeader() {
        await this.waitForElement(this.confirmationHeader);
        return await this.getText(this.confirmationHeader);
    }

    /**
     * Get confirmation body text
     * @returns {Promise<string>}
     */
    async getConfirmationText() {
        return await this.getText(this.confirmationText);
    }

    /**
     * Go back to products page after order
     */
    async backToProducts() {
        await this.page.click(this.backHomeButton);
        await this.page.waitForURL('**/inventory.html');
    }
}
