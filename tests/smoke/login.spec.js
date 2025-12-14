import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import users from '../../test-data/users.json' assert { type: 'json' };
import { ERROR_MESSAGES } from '../../utils/Constants.js';

test.describe('Login Functionality - Smoke Tests', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should login successfully with valid credentials', async () => {
        // Arrange
        const { username, password } = users.validUser;

        // Act
        await loginPage.login(username, password);

        // Assert
        expect(await loginPage.isLoginSuccessful()).toBeTruthy();
        expect(loginPage.getCurrentUrl()).toContain('inventory.html');
    });

    test('should show error message with invalid credentials', async () => {
        // Arrange
        const { username, password } = users.invalidUser;

        // Act
        await loginPage.login(username, password);

        // Assert
        expect(await loginPage.isErrorDisplayed()).toBeTruthy();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(ERROR_MESSAGES.INVALID_CREDENTIALS);
    });

    test('should show error for locked out user', async () => {
        // Arrange
        const { username, password } = users.lockedUser;

        // Act
        await loginPage.login(username, password);

        // Assert
        expect(await loginPage.isErrorDisplayed()).toBeTruthy();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(ERROR_MESSAGES.LOCKED_USER);
    });

    test('should show error when username is empty', async () => {
        // Arrange
        const password = users.validUser.password;

        // Act
        await loginPage.login('', password);

        // Assert
        expect(await loginPage.isErrorDisplayed()).toBeTruthy();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(ERROR_MESSAGES.REQUIRED_USERNAME);
    });

    test('should show error when password is empty', async () => {
        // Arrange
        const username = users.validUser.username;

        // Act
        await loginPage.login(username, '');

        // Assert
        expect(await loginPage.isErrorDisplayed()).toBeTruthy();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(ERROR_MESSAGES.REQUIRED_PASSWORD);
    });
});