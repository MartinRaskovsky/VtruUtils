# VtruUtils

**Author:** Dr. Martín Raskovsky  
**Date:** January 2025  

## Project Description

This project for Vitruveo blockchain-related operations, providing reusable classes, environment-based configuration management, and program scripts for execution. It is designed for developers looking to simplify tasks like Vault and Wallet content listing.

### Real-World Applications

- **`bin/getVaultDetails.js`**: Retrieves the balance of Vault coins and the balances of different coins in the wallets associated with a Vault.
- **`bin/getVaultsDetails.js`**: Retrieves balances for multiple Vaults holding more than a specified number of coins.
- **`bin/getVaultUsage.sh`**: Executes `getVaultsDetails.js` and converts the JSON output into a convenient `.csv` file using `jsonDetails2Csv.js`.

**Important Note**: All programs in the `src/bin` directory must be executed while located in that directory.

## Directory Structure

- **`src/lib`**: Contains reusable JavaScript classes and core logic.
- **`src/data`**: Stores configuration files like `.env` and other data resources.
- **`src/bin`**: Contains executable scripts or main programs.
- **`src/tests`**: Contains executable test programs.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or yarn

### Installation

1. Ensure Node.js is installed. You can download it from [Node.js Official Website](https://nodejs.org/).

2. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

3. Install dependencies:
   ```bash
   npm install
   # Or, if using yarn:
   yarn install
   ```

4. Install additional dependencies:
   ```bash
   npm install date-fns dotenv
   ```

5. Configure the `.env` file:
   - Navigate to `src/data/`.
   - Create a `.env` file and set the required environment variables:
     ```plaintext
     WALLETS=wallet1,wallet2,wallet3  # A comma-separated list of wallet identifiers
     VAULT_ADDRESS=0xYourVaultAddress  # The address of the vault contract
     CONFIG_JSON_FILE_PATH=../data/vtru-contracts.json  # Relative path to the configuration JSON file
     ```
   - Alternatively, refer to the provided `.env.example` file for guidance.

## Running Tests

Tests are located in the `src/tests` directory and can be executed using the `testAll.sh` script:

### Running Tests at Installation Time
After installing dependencies, you can run the test suite with:
```bash
sh src/tests/testAll.sh
```

### Running Tests at Any Time
To manually run the tests at any time, use:
```bash
cd src/tests && sh testAll.sh
```

## Usage

### Running Scripts
Execute scripts located in `src/bin`:
```bash
node src/bin/yourScript.js
```

### Example Script
Check the balances of a wallet:
```bash
node src/bin/getVaultDetails.js 0xYourVaultAddress
```
Expected output:
```
{
  "name": "Owner's Vault",
  "held": "vtru held",
  "staked": "vtru stacked",
  "verses": "verses held",
  "vibes": "number of vibes"
}

...
```

### Adding New Environment Variables
1. Update the `src/data/.env` file with the new variables.
2. Use the `VtruConfig` class to access them in your code:
   ```javascript
   const VtruConfig = require('../lib/vtruConfig');
   const config = new VtruConfig();
   console.log(config.get("VAULT_ADDRESS"));
   ```

## Contributing
We welcome contributions to this project! Follow these steps to get started:

1. Fork this repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b my-feature-branch
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add a new feature"
   ```
4. Push your branch and create a pull request:
   ```bash
   git push origin my-feature-branch
   ```

For significant changes, please open an issue to discuss them first. Follow the project's coding style and include tests for new functionality where applicable.

## License
[MIT License](LICENSE)

---

### Badges
![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green) ![License](https://img.shields.io/badge/License-MIT-blue)

This README provides a clear guide to setting up, using, and contributing to the project. If you encounter any issues, please open an issue in the repository.

