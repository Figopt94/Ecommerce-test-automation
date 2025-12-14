export const URLS = {
    BASE_URL: 'https://www.saucedemo.com',
    LOGIN: '/',
    INVENTORY: '/inventory.html',
    CART: '/cart.html',
    CHECKOUT_STEP_ONE: '/checkout-step-one.html',
    CHECKOUT_STEP_TWO: '/checkout-step-two.html',
    CHECKOUT_COMPLETE: '/checkout-complete.html'
};

export const TIMEOUTS = {
    DEFAULT: 30000,
    NAVIGATION: 30000,
    SHORT: 5000,
    LONG: 60000
};

export const ERROR_MESSAGES = {
    LOCKED_USER: 'Epic sadface: Sorry, this user has been locked out.',
    INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
    REQUIRED_USERNAME: 'Epic sadface: Username is required',
    REQUIRED_PASSWORD: 'Epic sadface: Password is required'
};

export const SUCCESS_MESSAGES = {
    ORDER_COMPLETE: 'Thank you for your order!',
    ORDER_DISPATCHED: 'Your order has been dispatched'
};