const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { keccak256 } = require("ethereum-cryptography/keccak");
const {
  utf8ToBytes,
  toHex,
  hexToBytes,
} = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");

app.use(cors());
app.use(express.json());

const balances = {
  "0xc97ed823fb50a42c1492db17f717ca1d83aefcac": 100, // vitalik
  "0xea950832cce651b207f3b45e0200c32516aa92ec": 200, // satoshi
  "0x342b8587049c769cae2f97569fa97daf2c119a12": 300, // cobie
};

app.get("/balances", (req, res) => {
  res.send(balances);
});

app.post("/send", (req, res) => {
  // TODO:
  // 1. get a signature from the client side application
  // 2. recover the public key from the signature and that is going to be the sender

  // do not allow client to set the sender because that is main security issue for this lesson
  // if we derive the address from the signature, we know that the sender is the owner of the private key

  const { signatureHex, recoveryBit, message } = req.body;
  const { recipient, amount } = message;

  // hash the message
  const msgHash = keccak256(utf8ToBytes(JSON.stringify(message)));

  // convert signature from hex to bytes (had to be hex format for transmission over network)
  const signatureBytes = hexToBytes(signatureHex);

  // recover public key using msgHash, signature, and recoveryBit
  const publicKey = secp.recoverPublicKey(msgHash, signatureBytes, recoveryBit);

  // convert public key to address that is the sender of the transaction
  const sender = "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20));

  if (balances[sender] < +amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= +amount;
    balances[recipient] += +amount;
    res.send({ balances: balances });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
