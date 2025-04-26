
# VtruUtils

Author: Dr. Martín Raskovsky  
Date: February 2025  

Project Description
-------------------
This project is designed for Vitruveo blockchain-related operations, providing reusable classes, environment-based configuration management, and program scripts for execution. It is meant for developers looking to simplify tasks like Vault and Wallet content listing.

Real-World Applications
------------------------
- bin/getVaultDetails.js: Retrieves the balance of Vault coins and the balances of different coins in the wallets associated with a Vault.
- bin/getVaultsDetails.js: Retrieves balances for multiple Vaults holding more than a specified number of coins.
- bin/getVaultUsage.sh: Executes getVaultsDetails.js and converts the JSON output into a convenient .csv file using jsonDetails2Csv.js.

Important Note: All programs in the src/bin directory must be executed while located inside that directory.

Directory Structure
--------------------
admin/         Admin/maintenance scripts (e.g., code generation for constants).
bin/           Command-line scripts for vault operations, JSON output, etc.
cgi-bin/       Perl CGI scripts for Apache (legacy vault dashboard and login).
data/          Static configuration files (.env, vault samples).
db/            MySQL database schema and Perl DB connection utilities.
dev/           Temporary development scratch files and experiments.
doc/           Internal documentation and project notes.
lib/           JavaScript shared libraries for Node.js backend tools.
logs/          Debugging and runtime error logs (especially for CGI backend).
next/          Next.js/React frontend application (live dashboard and API endpoints).
node_modules/  Node.js modules for backend CLI tools (src/package.json).
perl-lib/      Shared Perl library modules (.pm files).
public/        Static public web assets (images, stylesheets).
server-obsolete/ Old Express-based Node.js server (deprecated).
shared/        Shared constants and metadata between server and frontend.
tests/         Automated test scripts and validation utilities.

Node.js Environments
---------------------
- src/ has its own package.json for CLI tools and CGI helpers.
- src/next/ has its own package.json for the Next.js frontend app.

Important:
- Run npm install inside src/ for backend dependencies.
- Run npm install inside src/next/ for frontend dependencies.

These are intentionally kept separate.

Setup Instructions
--------------------
Requirements:
- Node.js v22.4.0
- npm or yarn
- express, ethers, cors, dotenv, fs-extra, body-parser

Installation:

1. Ensure Node.js is installed.
2. Clone the repository:
   git clone <repository-url>
   cd <repository-name>

3. Install backend/server dependencies:
   cd src
   npm install

4. Install frontend dependencies:
   cd src/next
   npm install

5. Configure environment variables:
   - Navigate to src/data/
   - Create a .env file based on .env.example.

Usage
------
Running Scripts:

cd src/bin
node yourScript.js

Example: demo.js usage:
- Defines wallet addresses.
- Fetches balances across selected networks.
- Prints results formatted with currency symbols.

Running the Web Server:

cd src/server
node server.js

Then open http://localhost:3000 in your browser.

Adding New Environment Variables:

Update src/data/.env and access in your code:
const Config = require('../lib/libConfig');
const config = new Config();
console.log(config.get("VAULT_ADDRESS"));

Contributing
-------------
1. Fork the repository.
2. Create a branch:
   git checkout -b feature/my-feature
3. Commit your changes:
   git commit -m "feat: add my feature"
4. Push and open a pull request:
   git push origin feature/my-feature

License
--------
MIT License

Badges
-------
[Node.js 22+]  
[MIT License]

--------------------------------------------

# VaWa Frontend Application (src/next/)

Author: Dr. Martín Raskovsky  
Date: April 2025  

Project Overview
------------------
This folder contains the Next.js 14 / React frontend and associated server-side logic for the VaWa project.

It replaces the earlier Perl/CGI web interface.

Directory Structure
---------------------
abi/            Blockchain smart contract ABIs.
app/            Main Next.js App Router (pages, server and client components).
components/     Reusable React components (tables, modals, sections).
config/         Static configuration (section mappings, groupings).
generated/      Auto-generated JavaScript files (e.g., ABIs, constants).
lib/            Client-side libraries, helper functions, and custom hooks.
node_modules/   Frontend dependencies (Next.js, React, etc.).
styles/         CSS and styling assets.

Node.js Environment
--------------------
- Separate package.json inside src/next/.
- Install frontend dependencies:
    cd src/next
    npm install
- Start the development server:
    npm run dev

(Default port: 3000)

Key Features
-------------
- Full React/Next.js vault and wallet dashboard.
- Modal-based transaction initiation (planned).
- Multi-chain balance diffs (EVM, Solana, Tezos).
- Future bridging and cross-chain operations.

Purpose
--------
- Vault analytics.
- Transaction management.
- User profile and login integration.
- Extensible token and chain support.

License
--------
MIT License

