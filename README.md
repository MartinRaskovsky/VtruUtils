# VtruUtils

**Author:** Dr. Martín Raskovsky  
**Date:** February 2025  

## Project Description

This project is designed for Vitruveo blockchain-related operations, providing reusable classes, environment-based configuration management, and program scripts for execution. It is meant for developers looking to simplify tasks like Vault and Wallet content listing.

### Real-World Applications

- **`bin/getVaultDetails.js`**: Retrieves the balance of Vault coins and the balances of different coins in the wallets associated with a Vault.
- **`bin/getVaultsDetails.js`**: Retrieves balances for multiple Vaults holding more than a specified number of coins.
- **`bin/getVaultUsage.sh`**: Executes `getVaultsDetails.js` and converts the JSON output into a convenient `.csv` file using `jsonDetails2Csv.js`.

**Important Note**: All programs in the `src/bin` directory must be executed while located in that directory.

## Directory Structure

```
src/
├── bin/         # Executable scripts
├── data/        # Configuration files (e.g., .env)
├── lib/         # Reusable JavaScript classes
├── public/      # Client-side code (HTML, JS, CSS)
├── server/      # Express-based API server
├── shared/      # Shared modules (e.g., constants.js)
├── tests/       # Automated test scripts
└── README.md    # Project documentation
```

### Explanation of Components

- **`src/bin`**: Contains command-line scripts that produce JSON output or optionally formatted output with `-f`. These scripts **do not require the web server** and are fully functional on their own.
- **`src/server` & `src/public`**: Implement a **local web server** that provides an HTML interface to interact with the scripts. It is **not required** for running command-line scripts but offers a convenient way to display results in a browser.
- **`src/shared`**: Provides shared constants and modules that can be used across **server, client, and scripts**, ensuring a **single source of truth**.

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

### Example Usage: `demo.js`

The `demo.js` script illustrates the fundamental operation of the library by fetching wallet balances across multiple blockchain networks. Below, we break down its core functionality.

#### Key Components

- **Web3 Library (`libWeb3`)**: Provides blockchain connectivity and abstraction for different networks.
- **Network Library (`libNetwork`)**: Manages multiple blockchain instances simultaneously.
- **Token Wallet (`tokenWallet`)**: A class to handle token balances for specified wallet addresses.
- **Utility Functions (`vtruUtils`)**: Includes functions for formatting and scaling numbers.

#### Example Execution

##### 1. Define Wallet Addresses

The script defines a list of wallet addresses for which balances will be retrieved. In practice, these would be replaced by actual wallet addresses:

```javascript
const wallets = [
    'WALLET_ADDRESS_1', 
    'WALLET_ADDRESS_2'
];
```

##### 2. Fetch Wallet Balances

The function `getWalletBalance` retrieves the balances for the given wallets on a specified network:

```javascript
async function getWalletBalance(web3) {
    const id = web3.getId();
    const tokenWallet = new TokenWallet(web3);
    const balances = await tokenWallet.getBalances(wallets);
    balances.map((balance, index) => {
      console.log(`${wallets[index]}: ${Web3.currency[id]} ${formatRawNumber(balance,3)}`);
    });
}
```

- Uses the `TokenWallet` class to fetch balances.
- Formats and prints the balance using `formatRawNumber(balance,3)`.
- Retrieves the currency symbol dynamically based on the network.

##### 3. Multi-Network and Single-Network Support

The script initializes blockchain networks in two ways:

- **Multiple Networks at Once**:

```javascript
const network = await new Network([Web3.VTRU, Web3.BSC]);
const vtru = network.get(Web3.VTRU);
const bsc = network.get(Web3.BSC);
```

- **Single Network Initialization**:

```javascript
const eth = Web3.create(Web3.ETH);
```

- This method is used when interacting with only one blockchain.

##### 4. Execute Tests

Finally, the script fetches balances for all wallets on all selected networks:

```javascript
await getWalletBalance(vtru);
await getWalletBalance(bsc);
await getWalletBalance(eth);
```

#### Sample Output

Running `demo.js` produces the following output:

```
WALLET_ADDRESS_1: VTRU 41.115
WALLET_ADDRESS_2: VTRU 1.651
WALLET_ADDRESS_1: BNB 0.000
WALLET_ADDRESS_2: BNB 0.011
WALLET_ADDRESS_1: ETH 0.010
WALLET_ADDRESS_2: ETH 0.031
```

- Balances are displayed per wallet address.
- The correct currency is assigned based on the network.
- The script demonstrates seamless interaction with multiple blockchains.

#### Conclusion

This example illustrates how the library abstracts blockchain interactions, allowing developers to query multiple networks without worrying about low-level implementation details. The modular approach ensures scalability, making it easy to extend support for additional networks in the future.

It is important to note that this is only a basic example and the library provides a much broader range of capabilities beyond those demonstrated here.


### Running the Web Server

The web interface is **optional** but can be started locally with:

```bash
node src/server/server.js
```

Then, open `http://localhost:3000` in a browser.

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
