import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';
import users from '../../test-data/users.json' assert { type: 'json' };

test.describe('Inventory Page - Regression Tests', () => {
    let loginPage;
    let inventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        
        // Login before each test
        await loginPage.goto();
        await loginPage.login(users.validUser.username, users.validUser.password);
        await inventoryPage.waitForPageLoad();
    });

    test('should display all products on inventory page', async () => {
        // Act
        const products = await inventoryPage.getAllProductNames();

        // Assert
        expect(products.length).toBe(6); // SauceDemo has 6 products
        expect(products).toContain('Sauce Labs Backpack');
        expect(products).toContain('Sauce Labs Bike Light');
    });

    test('should add product to cart successfully', async () => {
        // Arrange
        const productName = 'Sauce Labs Backpack';

        // Act
        await inventoryPage.addProductToCart(productName);

        // Assert
        expect(await inventoryPage.isCartBadgeVisible()).toBeTruthy();
        expect(await inventoryPage.getCartItemsCount()).toBe(1);
    });

    test('should add multiple products to cart', async () => {
        // Arrange
        const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];

        // Act
        for (const product of products) {
            await inventoryPage.addProductToCart(product);
        }

        // Assert
        expect(await inventoryPage.getCartItemsCount()).toBe(3);
    });

    test('should remove product from cart', async () => {
        // Arrange
        const productName = 'Sauce Labs Backpack';
        await inventoryPage.addProductToCart(productName);
        expect(await inventoryPage.getCartItemsCount()).toBe(1);

        // Act
        await inventoryPage.removeProductFromCart(productName);

        // Assert
        expect(await inventoryPage.isCartBadgeVisible()).toBeFalsy();
    });

    test('should sort products by name A to Z', async () => {
        // Act
        await inventoryPage.sortProducts('az');
        const products = await inventoryPage.getAllProductNames();

        // Assert
        const sortedProducts = [...products].sort();
        expect(products).toEqual(sortedProducts);
    });

    test('should sort products by name Z to A', async () => {
        // Act
        await inventoryPage.sortProducts('za');
        const products = await inventoryPage.getAllProductNames();

        // Assert
        const sortedProducts = [...products].sort().reverse();
        expect(products).toEqual(sortedProducts);
    });

    test('should sort products by price low to high', async () => {
        // Act
        await inventoryPage.sortProducts('lohi');
        const prices = await inventoryPage.getAllProductPrices();

        // Assert
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sortedPrices);
    });

    test('should sort products by price high to low', async () => {
        // Act
        await inventoryPage.sortProducts('hilo');
        const prices = await inventoryPage.getAllProductPrices();

        // Assert
        const sortedPrices = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(sortedPrices);
    });

    test('should navigate to cart page', async () => {
        // Arrange
        await inventoryPage.addProductToCart('Sauce Labs Backpack');

        // Act
        await inventoryPage.goToCart();

        // Assert
        expect(inventoryPage.getCurrentUrl()).toContain('/cart.html');
    });

    test('should logout successfully', async ({ page }) => {
        // Act
        await inventoryPage.logout();

        // Assert
        await page.waitForURL('**/');
        expect(page.url()).toBe('https://www.saucedemo.com/');
    });
});