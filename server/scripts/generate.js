const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

// generate a random private key
const privateKey = secp.utils.randomPrivateKey();

// convert private key to hex for console output
console.log("private key:", toHex(privateKey));

// derive the public key from the private key
const publicKey = secp.getPublicKey(privateKey);

// convert public key to hex for console output
console.log("public key:", toHex(publicKey));

// derive ethereum address from public key
const address = "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20));

console.log("address:", address);
