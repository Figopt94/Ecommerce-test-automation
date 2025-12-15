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
        this.addToCartButton = (productName) => `//div[text()='${productName}']/ancestor::div[@class='inventory_item']//button[contains(@class,'btn_inventory')]`;
        this.removeFromCartButton = (productName) => `//div[text()='${productName}']/ancestor::div[@class='inventory_item']//button[contains(text(),'Remove')]`;
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
        return await this.page.$$eval(this.inventoryItemName, 
            elements => elements.map(el => el.textContent)
        );
    }

    /**
     * Get all product prices
     * @returns {Promise<number[]>} Array of product prices
     */
    async getAllProductPrices() {
        await this.waitForPageLoad();
        const priceTexts = await this.page.$$eval(this.inventoryItemPrice,
            elements => elements.map(el => el.textContent)
        );
        // Convert "$29.99" to 29.99
        return priceTexts.map(price => parseFloat(price.replace('$', '')));
    }

    /**
     * Add product to cart by name
     * @param {string} productName - Name of the product
     */
    async addProductToCart(productName) {
        await this.page.click(this.addToCartButton(productName));
    }

    /**
     * Remove product from cart by name
     * @param {string} productName - Name of the product
     */
    async removeProductFromCart(productName) {
        await this.page.click(this.removeFromCartButton(productName));
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
        await this.page.waitForTimeout(500); // Wait for sort to apply
    }

    /**
     * Logout from application
     */
    async logout() {
        await this.page.click(this.burgerMenuButton);
        await this.waitForElement(this.logoutLink);
        await this.page.click(this.logoutLink);
    }

    /**
     * Verify user is on inventory page
     * @returns {boolean} True if on inventory page
     */
    isOnInventoryPage() {
        return this.getCurrentUrl().includes('/inventory.html');
    }
}