import { BasePage } from './BasePage.js';

export class CartPage extends BasePage {
    constructor(page) {
        super(page);

        // Locators
        this.cartContainer = '.cart_contents_container';
        this.cartItem = '.cart_item';
        this.cartItemName = '.inventory_item_name';
        this.cartItemPrice = '.inventory_item_price';
        this.cartItemQuantity = '.cart_quantity';
        this.removeButton = (productName) =>
            `//div[text()='${productName}']/ancestor::div[@class='cart_item']//button[contains(@class,'btn_secondary')]`;
        this.continueShoppingButton = '#continue-shopping';
        this.checkoutButton = '#checkout';
        this.cartEmptyMessage = '.removed_cart_item';
    }

    /**
     * Wait for cart page to load
     */
    async waitForPageLoad() {
        await this.waitForElement(this.cartContainer);
    }

    /**
     * Check if currently on cart page
     * @returns {Promise<boolean>}
     */
    async isOnCartPage() {
        try {
            await this.page.waitForURL('**/cart.html', { timeout: 5000 });
            return this.getCurrentUrl().includes('/cart.html');
        } catch {
            return false;
        }
    }

    /**
     * Get all cart item names
     * @returns {Promise<string[]>}
     */
    async getCartItemNames() {
        await this.waitForPageLoad();
        const elements = await this.page.locator(this.cartItemName).all();
        return await Promise.all(elements.map(el => el.textContent()));
    }

    /**
     * Get number of items in cart
     * @returns {Promise<number>}
     */
    async getCartItemCount() {
        await this.waitForPageLoad();
        return await this.page.locator(this.cartItem).count();
    }

    /**
     * Get price of a specific cart item
     * @param {string} productName - Name of the product
     * @returns {Promise<string>}
     */
    async getItemPrice(productName) {
        const priceLocator = this.page.locator(
            `//div[text()='${productName}']/ancestor::div[@class='cart_item']//div[@class='inventory_item_price']`
        );
        return await priceLocator.textContent();
    }

    /**
     * Get quantity of a specific cart item
     * @param {string} productName - Name of the product
     * @returns {Promise<number>}
     */
    async getItemQuantity(productName) {
        const quantityLocator = this.page.locator(
            `//div[text()='${productName}']/ancestor::div[@class='cart_item']//div[@class='cart_quantity']`
        );
        const text = await quantityLocator.textContent();
        return parseInt(text);
    }

    /**
     * Remove an item from the cart
     * @param {string} productName - Name of the product
     */
    async removeItem(productName) {
        await this.page.locator(this.removeButton(productName)).click();
    }

    /**
     * Check if cart has no items
     * @returns {Promise<boolean>}
     */
    async isEmpty() {
        await this.waitForPageLoad();
        const count = await this.page.locator(this.cartItem).count();
        return count === 0;
    }

    /**
     * Click Continue Shopping button
     */
    async continueShopping() {
        await this.page.click(this.continueShoppingButton);
        await this.page.waitForURL('**/inventory.html');
    }

    /**
     * Click Checkout button
     */
    async proceedToCheckout() {
        await this.page.click(this.checkoutButton);
        await this.page.waitForURL('**/checkout-step-one.html');
    }
}
