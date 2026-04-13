import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';
import { CartPage } from '../../pages/CartPage.js';
import { CheckoutPage } from '../../pages/CheckoutPage.js';
import users from '../../test-data/users.json' assert { type: 'json' };
import checkoutData from '../../test-data/checkout.json' assert { type: 'json' };

test.describe('Purchase Flow - E2E Tests', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;
    let checkoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
    });

    test('should complete full purchase flow with single product', async () => {
        const { firstName, lastName, zipCode } = checkoutData.validCustomer;
        const productName = 'Sauce Labs Backpack';

        // Step 1: Login
        await loginPage.goto();
        await loginPage.login(users.validUser.username, users.validUser.password);
        expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        // Step 2: Add product to cart
        await inventoryPage.waitForPageLoad();
        await inventoryPage.addProductToCart(productName);
        expect(await inventoryPage.getCartItemsCount()).toBe(1);

        // Step 3: Go to cart and verify product
        await inventoryPage.goToCart();
        expect(await cartPage.isOnCartPage()).toBeTruthy();
        expect(await cartPage.getCartItemCount()).toBe(1);
        const cartItems = await cartPage.getCartItemNames();
        expect(cartItems).toContain(productName);

        // Step 4: Proceed to checkout and fill info
        await cartPage.proceedToCheckout();
        expect(await checkoutPage.isOnStepOne()).toBeTruthy();
        await checkoutPage.fillShippingInfo(firstName, lastName, zipCode);

        // Step 5: Verify order overview
        expect(await checkoutPage.isOnStepTwo()).toBeTruthy();
        const overviewItems = await checkoutPage.getOverviewItemNames();
        expect(overviewItems).toContain(productName);

        // Step 6: Finish order
        await checkoutPage.finishOrder();
        expect(await checkoutPage.isOrderComplete()).toBeTruthy();
        const confirmation = await checkoutPage.getConfirmationHeader();
        expect(confirmation).toContain('Thank you for your order!');
    });

    test('should complete full purchase flow with multiple products', async () => {
        const { firstName, lastName, zipCode } = checkoutData.validCustomer;
        const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Fleece Jacket'];

        // Step 1: Login
        await loginPage.goto();
        await loginPage.login(users.validUser.username, users.validUser.password);
        expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        // Step 2: Add multiple products
        await inventoryPage.waitForPageLoad();
        for (const product of products) {
            await inventoryPage.addProductToCart(product);
        }
        expect(await inventoryPage.getCartItemsCount()).toBe(products.length);

        // Step 3: Go to cart and verify all products
        await inventoryPage.goToCart();
        expect(await cartPage.getCartItemCount()).toBe(products.length);

        // Step 4: Checkout
        await cartPage.proceedToCheckout();
        await checkoutPage.fillShippingInfo(firstName, lastName, zipCode);

        // Step 5: Verify all items appear in overview
        const overviewItems = await checkoutPage.getOverviewItemNames();
        for (const product of products) {
            expect(overviewItems).toContain(product);
        }

        // Step 6: Finish order
        await checkoutPage.finishOrder();
        expect(await checkoutPage.isOrderComplete()).toBeTruthy();
    });

    test('should complete purchase and return to inventory for new purchase', async () => {
        const { firstName, lastName, zipCode } = checkoutData.validCustomer;

        // Step 1: Login
        await loginPage.goto();
        await loginPage.login(users.validUser.username, users.validUser.password);

        // Step 2: Purchase
        await inventoryPage.waitForPageLoad();
        await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');
        await inventoryPage.goToCart();
        await cartPage.proceedToCheckout();
        await checkoutPage.fillShippingInfo(firstName, lastName, zipCode);
        await checkoutPage.finishOrder();

        // Step 3: Back to products
        expect(await checkoutPage.isOrderComplete()).toBeTruthy();
        await checkoutPage.backToProducts();

        // Step 4: Verify back on inventory with empty cart
        expect(inventoryPage.getCurrentUrl()).toContain('/inventory.html');
        expect(await inventoryPage.isCartBadgeVisible()).toBeFalsy();
    });

    test('should sort products before adding to cart and complete purchase', async () => {
        const { firstName, lastName, zipCode } = checkoutData.validCustomer;

        // Step 1: Login
        await loginPage.goto();
        await loginPage.login(users.validUser.username, users.validUser.password);
        await inventoryPage.waitForPageLoad();

        // Step 2: Sort by price low to high and add cheapest product
        await inventoryPage.sortProducts('lohi');
        const prices = await inventoryPage.getAllProductPrices();
        const names = await inventoryPage.getAllProductNames();
        const cheapestProduct = names[0];
        expect(prices[0]).toBeLessThanOrEqual(prices[prices.length - 1]);

        // Step 3: Add and purchase
        await inventoryPage.addProductToCart(cheapestProduct);
        await inventoryPage.goToCart();
        await cartPage.proceedToCheckout();
        await checkoutPage.fillShippingInfo(firstName, lastName, zipCode);

        // Step 4: Verify correct item in overview
        const overviewItems = await checkoutPage.getOverviewItemNames();
        expect(overviewItems).toContain(cheapestProduct);

        await checkoutPage.finishOrder();
        expect(await checkoutPage.isOrderComplete()).toBeTruthy();
    });
});
