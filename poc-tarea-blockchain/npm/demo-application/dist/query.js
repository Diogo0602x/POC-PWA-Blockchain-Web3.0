"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_network_1 = require("fabric-network");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
async function main() {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'Org1Wallet');
        const wallet = await fabric_network_1.Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Create a new gateway for connecting to our peer node.
        const gateway = new fabric_network_1.Gateway();
        const connectionProfilePath = path.resolve(__dirname, '..', 'connection.json');
        const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8')); // eslintdisable-line @typescript-eslint/no-unsafe-assignment
        const connectionOptions = { wallet, identity: 'Org1 Admin', discovery: { enabled: true, asLocalhost: true } };
        await gateway.connect(connectionProfile, connectionOptions);
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('demo-contract');
        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('readMyAsset', '002');
        console.log(`Transaction has been evaluated, result is:
${result.toString()}`);
        // Disconnect from the gateway.
        gateway.disconnect();
    }
    catch (error) {
        console.error('Failed to submit transaction:', error);
        process.exit(1);
    }
}
void main();
//# sourceMappingURL=query.js.map