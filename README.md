# EduStore DApp

EduStore is a decentralized application where users can upload, purchase, and download educational content. This project was developed for the OpenCampus hackathon on Dorahacks and is integrated with Web3 technologies.

## Features

- **Content Uploading**: Users can upload educational content to the platform.
- **Purchasing**: Users can purchase content on the platform using EDU tokens.
- **Downloading**: Purchased content can be downloaded by users.

## Installation

Follow the steps below to set up and run the project:

### 1. Clone the Repository

```bash
git clone https://github.com/theritalin/EduStore
cd EduStore
```

### 2. Install Dependencies

```bash
npm install

```

### 3. Setup Env

Create .env file

```bash
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_api_key


```

### 4. Start Server and Bakend Server

```
npm start
node src/server.js
```

## Usage

Connect Wallet: Ensure your wallet is connected for the application to function properly.
Upload Content: Click the "UPLOAD +" button to add new content.
Purchase: Buy the content you're interested in using EDU tokens.
Download: Download and view the content you have purchased.

## Technologies

React: Frontend library
Solidity: Smart contract language
Ethers.js: Ethereum wallet and blockchain interaction
IPFS: Decentralized file storage
Pinata: IPFS management and file uploading

## Smart Contract

The project operates on a smart contract developed on Open Campus Codex, enabling the uploading, purchasing, and verification of educational content.

Contract: 0x62e67d0750506098E4a3359Af65A213b34D98f98
Explorer: https://opencampus-codex.blockscout.com/address/0x62e67d0750506098E4a3359Af65A213b34D98f98

## Contributing

If you would like to contribute, please submit a pull request. We welcome all feedback and suggestions.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact

If you have any questions about this project, feel free to reach out.
