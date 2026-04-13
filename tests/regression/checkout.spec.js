import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';
import { CartPage } from '../../pages/CartPage.js';
import { CheckoutPage } from '../../pages/CheckoutPage.js';
import users from '../../test-data/users.json' assert { type: 'json' };
import checkoutData from '../../test-data/checkout.json' assert { type: 'json' };

test.describe('Checkout Flow - Regression Tests', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;
    let checkoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        // Login and add a product to cart before each test
        await loginPage.goto();
        await loginPage.login(users.validUser.username, users.validUser.password);
        await inventoryPage.waitForPageLoad();
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();
        await cartPage.proceedToCheckout();
    });

    test('should be on checkout step one after proceeding from cart', async () => {
        // Assert
        expect(await checkoutPage.isOnStepOne()).toBeTruthy();
    });

    test('should show error when all fields are empty', async () => {
        // Act
        await checkoutPage.fillShippingInfo('', '', '');

        // Assert
        expect(await checkoutPage.isErrorDisplayed()).toBeTruthy();
        const error = await checkoutPage.getErrorMessage();
        expect(error).toContain('First Name is required');
    });

    test('should show error when first name is missing', async () => {
        // Arrange
        const { lastName, zipCode } = checkoutData.missingFirstName;

        // Act
        await checkoutPage.fillShippingInfo('', lastName, zipCode);

        // Assert
        expect(await checkoutPage.isErrorDisplayed()).toBeTruthy();
        const error = await checkoutPage.getErrorMessage();
        expect(error).toContain('First Name is required');
    });

    test('should show error when last name is missing', async () => {
        // Arrange
        const { firstName, zipCode } = checkoutData.missingLastName;

        // Act
        await checkoutPage.fillShippingInfo(firstName, '', zipCode);

        // Assert
        expect(await checkoutPage.isErrorDisplayed()).toBeTruthy();
        const error = await checkoutPage.getErrorMessage();
        expect(error).toContain('Last Name is required');
    });

    test('should show error when zip code is missing', async () => {
        // Arrange
        const { firstName, lastName } = checkoutData.missingZipCode;

        // Act
        await checkoutPage.fillShippingInfo(firstName, lastName, '');

        // Assert
        expect(await checkoutPage.isErrorDisplayed()).toBeTruthy();
        const error = await checkoutPage.getErrorMessage();
        expect(error).toContain('Postal Code is required');
    });

    test('should proceed to order overview with valid shipping info', async () => {
        // Arrange
        const { firstName, lastName, zipCode } = checkoutData.validCustomer;

        // Act
        await checkoutPage.fillShippingInfo(firstName, lastName, zipCode);

        // Assert
        expect(await checkoutPage.isOnStepTwo()).toBeTruthy();
    });

    test('should display ordered items in overview', async () => {
        // Arrange
        const { firstName, lastName, zipCode } = checkoutData.validCustomer;
        await checkoutPage.fillShippingInfo(firstName, lastName, zipCode);

        // Assert
        const itemNames = await checkoutPage.getOverviewItemNames();
        expect(itemNames).toContain('Sauce Labs Backpack');
    });

    test('should display correct subtotal in overview', async () => {
        // Arrange
        const { firstName, lastName, zipCode } = checkoutData.validCustomer;
        await checkoutPage.fillShippingInfo(firstName, lastName, zipCode);

        // Assert - Sauce Labs Backpack costs $29.99
        const subtotal = await checkoutPage.getSubtotal();
        expect(subtotal).toContain('29.99');
    });

    test('should display tax in overview', async () => {
        // Arrange
        const { firstName, lastName, zipCode } = checkoutData.validCustomer;
        await checkoutPage.fillShippingInfo(firstName, lastName, zipCode);

        // Assert
        const tax = await checkoutPage.getTax();
        expect(tax).toContain('Tax:');
    });

    test('should display total with tax in overview', async () => {
        // Arrange
        const { firstName, lastName, zipCode } = checkoutData.validCustomer;
        await checkoutPage.fillShippingInfo(firstName, lastName, zipCode);

        // Assert - total should be higher than subtotal (includes tax)
        const subtotalText = await checkoutPage.getSubtotal();
        const totalText = await checkoutPage.getTotal();
        const subtotal = parseFloat(subtotalText.match(/[\d.]+/)[0]);
        const total = parseFloat(totalText.match(/[\d.]+/)[0]);
        expect(total).toBeGreaterThan(subtotal);
    });

    test('should complete order successfully', async () => {
        // Arrange
        const { firstName, lastName, zipCode } = checkoutData.validCustomer;
        await checkoutPage.fillShippingInfo(firstName, lastName, zipCode);

        // Act
        await checkoutPage.finishOrder();

        // Assert
        expect(await checkoutPage.isOrderComplete()).toBeTruthy();
        const confirmation = await checkoutPage.getConfirmationHeader();
        expect(confirmation).toContain('Thank you for your order!');
    });

    test('should go back to inventory after completing order', async () => {
        // Arrange
        const { firstName, lastName, zipCode } = checkoutData.validCustomer;
        await checkoutPage.fillShippingInfo(firstName, lastName, zipCode);
        await checkoutPage.finishOrder();

        // Act
        await checkoutPage.backToProducts();

        // Assert
        expect(checkoutPage.getCurrentUrl()).toContain('/inventory.html');
    });

    test('should cancel checkout and return to cart', async () => {
        // Act
        await checkoutPage.cancel();

        // Assert
        expect(checkoutPage.getCurrentUrl()).toContain('/cart.html');
    });
});
