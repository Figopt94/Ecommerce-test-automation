# 🛒 E-Commerce Test Automation Framework

Production-ready E2E test automation framework for e-commerce applications built with Playwright.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
# Clone repository
git clone https://github.com/Figopt94/ecommerce-test-automation.git
cd ecommerce-test-automation

# Install dependencies
npm install

# Install browsers
npx playwright install
```

### Running Tests
```bash
# Run all tests
npm test

# Run smoke tests
npm run test:smoke

# Run with UI mode
npm run test:ui

# Run in headed mode
npm run test:headed

# Generate report
npm run report
```

## 📁 Project Structure
```
ecommerce-test-automation/
├── pages/              # Page Object Models
├── tests/
│   ├── smoke/         # Critical path tests
│   ├── regression/    # Full test suite
│   └── e2e/          # End-to-end flows
├── test-data/         # Test data files
└── utils/            # Helper functions
```

## 🛠️ Tech Stack

- Playwright v1.40+
- JavaScript (ES6 Modules)
- Page Object Model
- GitHub Actions (coming soon)

## 📊 Current Status

- ✅ Project setup complete
- ✅ Login page tests (5 tests)
- 🔄 In progress: Inventory & Cart features
- ⏳ Planned: Full E2E purchase flow

## 📫 Contact

**Filipe Rodrigues**
- GitHub: [@Figopt94](https://github.com/Figopt94)

---

⭐ Star this repository if you find it helpful!