import { BasePage } from './BasePage.js';

export class InventoryPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Locators
        this.inventoryContainer = '.inventory_container';
        this.inventoryItem = '.inventory_item';
        this.inventoryItemName = '.inventory_item_name';
        this.inventoryItemPrice = '.inventory_item_price';
        this.inventoryItemDescription = '.inventory_item_desc';
        this.addToCartButton = (productName) => `//div[text()='${productName}']/ancestor::div[@class='inventory_item']//button[contains(@id,'add-to-cart')]`;
        this.removeFromCartButton = (productName) => `//div[text()='${productName}']/ancestor::div[@class='inventory_item']//button[contains(@id, 'remove')]`;
        this.shoppingCartBadge = '.shopping_cart_badge';
        this.shoppingCartLink = '.shopping_cart_link';
        this.productSortDropdown = '.product_sort_container';
        this.burgerMenuButton = '#react-burger-menu-btn';
        this.logoutLink = '#logout_sidebar_link';
    }

    /**
     * Wait for inventory page to load
     */
    async waitForPageLoad() {
        await this.waitForElement(this.inventoryContainer);
    }

    /**
     * Get all product names
     * @returns {Promise<string[]>} Array of product names
     */
    async getAllProductNames() {
        await this.waitForPageLoad();
        const elements = await this.page.locator(this.inventoryItemName).all();
        return await Promise.all(elements.map(el => el.textContent()));
    }

    /**
     * Get all product prices
     * @returns {Promise<number[]>} Array of product prices
     */
    async getAllProductPrices() {
        await this.waitForPageLoad();
        const elements = await this.page.locator(this.inventoryItemPrice).all();
        const priceTexts = await Promise.all(elements.map(el => el.textContent()));
        return priceTexts.map(price => parseFloat(price.replace('$', '')));
    }

    /**
     * Get product count
     * @returns {Promise<number>} Number of products displayed
     */
    async getProductCount() {
        await this.waitForPageLoad();
        return await this.page.locator(this.inventoryItem).count();
    }

    /**
     * Add product to cart by name
     * @param {string} productName - Name of the product
     */
    async addProductToCart(productName) {
        await this.page.locator(this.addToCartButton(productName)).click();
    }

    /**
     * Remove product from cart by name
     * @param {string} productName - Name of the product
     */
    async removeProductFromCart(productName) {
        await this.page.locator(this.removeFromCartButton(productName)).click();
    }

    /**
     * Check if product is in cart (has Remove button)
     * @param {string} productName - Name of the product
     * @returns {Promise<boolean>} True if product in cart
     */
    async isProductInCart(productName) {
        try {
            const removeButton = this.page.locator(this.removeFromCartButton(productName));
            return await removeButton.isVisible({ timeout: 2000 });
        } catch {
            return false;
        }
    }

    /**
     * Get cart items count from badge
     * @returns {Promise<number>} Number of items in cart
     */
    async getCartItemsCount() {
        if (await this.isVisible(this.shoppingCartBadge)) {
            const count = await this.getText(this.shoppingCartBadge);
            return parseInt(count);
        }
        return 0;
    }

    /**
     * Check if cart badge is visible
     * @returns {Promise<boolean>} True if badge visible
     */
    async isCartBadgeVisible() {
        return await this.isVisible(this.shoppingCartBadge);
    }

    /**
     * Click on shopping cart
     */
    async goToCart() {
        await this.page.click(this.shoppingCartLink);
    }

    /**
     * Sort products
     * @param {string} sortOption - Sort option (az, za, lohi, hilo)
     */
    async sortProducts(sortOption) {
        const sortValues = {
            'az': 'az',      // Name A to Z
            'za': 'za',      // Name Z to A
            'lohi': 'lohi',  // Price low to high
            'hilo': 'hilo'   // Price high to low
        };
        
        await this.page.selectOption(this.productSortDropdown, sortValues[sortOption]);
        await this.page.waitForLoadState('networkidle'); // Better than timeout
    }

    /**
     * Get product price by name
     * @param {string} productName - Name of the product
     * @returns {Promise<string>} Product price
     */
    async getProductPrice(productName) {
        const priceLocator = this.page.locator(
            `//div[text()='${productName}']/ancestor::div[@class='inventory_item']//div[@class='inventory_item_price']`
        );
        return await priceLocator.textContent();
    }

    /**
     * Logout from application
     */
    async logout() {
        await this.page.click(this.burgerMenuButton);
        await this.waitForElement(this.logoutLink);
        await this.page.waitForTimeout(300); // Wait for menu animation
        await this.page.click(this.logoutLink);
        await this.page.waitForURL('**/'); // Verify redirect to login
    }

    /**
     * Verify user is on inventory page
     * @returns {Promise<boolean>} True if on inventory page
     */
    async isOnInventoryPage() {
        try {
            await this.page.waitForURL('**/inventory.html', { timeout: 5000 });
            return this.getCurrentUrl().includes('/inventory.html');
        } catch {
            return false;
        }
    }
}