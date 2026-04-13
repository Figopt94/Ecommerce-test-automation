import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';
import { CartPage } from '../../pages/CartPage.js';
import users from '../../test-data/users.json' assert { type: 'json' };

test.describe('Cart Page - Regression Tests', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);

        await loginPage.goto();
        await loginPage.login(users.validUser.username, users.validUser.password);
        await inventoryPage.waitForPageLoad();
    });

    test('should navigate to cart page', async () => {
        // Act
        await inventoryPage.goToCart();

        // Assert
        expect(await cartPage.isOnCartPage()).toBeTruthy();
    });

    test('should display empty cart when no products added', async () => {
        // Act
        await inventoryPage.goToCart();

        // Assert
        expect(await cartPage.isEmpty()).toBeTruthy();
        expect(await cartPage.getCartItemCount()).toBe(0);
    });

    test('should display product added from inventory', async () => {
        // Arrange
        const productName = 'Sauce Labs Backpack';
        await inventoryPage.addProductToCart(productName);

        // Act
        await inventoryPage.goToCart();

        // Assert
        const itemNames = await cartPage.getCartItemNames();
        expect(itemNames).toContain(productName);
        expect(await cartPage.getCartItemCount()).toBe(1);
    });

    test('should display multiple products in cart', async () => {
        // Arrange
        const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
        for (const product of products) {
            await inventoryPage.addProductToCart(product);
        }

        // Act
        await inventoryPage.goToCart();

        // Assert
        expect(await cartPage.getCartItemCount()).toBe(3);
        const itemNames = await cartPage.getCartItemNames();
        for (const product of products) {
            expect(itemNames).toContain(product);
        }
    });

    test('should show correct quantity for each cart item', async () => {
        // Arrange
        const productName = 'Sauce Labs Backpack';
        await inventoryPage.addProductToCart(productName);
        await inventoryPage.goToCart();

        // Assert
        expect(await cartPage.getItemQuantity(productName)).toBe(1);
    });

    test('should show correct price for cart item', async () => {
        // Arrange
        const productName = 'Sauce Labs Backpack';
        const inventoryPrice = await inventoryPage.getProductPrice(productName);
        await inventoryPage.addProductToCart(productName);

        // Act
        await inventoryPage.goToCart();
        const cartPrice = await cartPage.getItemPrice(productName);

        // Assert
        expect(cartPrice).toBe(inventoryPrice);
    });

    test('should remove product from cart page', async () => {
        // Arrange
        const productName = 'Sauce Labs Backpack';
        await inventoryPage.addProductToCart(productName);
        await inventoryPage.goToCart();
        expect(await cartPage.getCartItemCount()).toBe(1);

        // Act
        await cartPage.removeItem(productName);

        // Assert
        expect(await cartPage.isEmpty()).toBeTruthy();
    });

    test('should update cart correctly after removing one of multiple items', async () => {
        // Arrange
        const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
        for (const product of products) {
            await inventoryPage.addProductToCart(product);
        }
        await inventoryPage.goToCart();

        // Act
        await cartPage.removeItem('Sauce Labs Backpack');

        // Assert
        expect(await cartPage.getCartItemCount()).toBe(1);
        const remainingItems = await cartPage.getCartItemNames();
        expect(remainingItems).toContain('Sauce Labs Bike Light');
        expect(remainingItems).not.toContain('Sauce Labs Backpack');
    });

    test('should return to inventory when clicking Continue Shopping', async () => {
        // Arrange
        await inventoryPage.goToCart();

        // Act
        await cartPage.continueShopping();

        // Assert
        expect(cartPage.getCurrentUrl()).toContain('/inventory.html');
    });

    test('should navigate to checkout when clicking Checkout button', async () => {
        // Arrange
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();

        // Act
        await cartPage.proceedToCheckout();

        // Assert
        expect(cartPage.getCurrentUrl()).toContain('/checkout-step-one.html');
    });
});
