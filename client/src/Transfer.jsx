import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer({ setBalances, accounts }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  console.log("privateKey", privateKey);

  async function transfer(evt) {
    evt.preventDefault();

    const message = { amount: sendAmount, recipient };

    // hash message for signature generation
    const msgHash = keccak256(utf8ToBytes(JSON.stringify(message)));

    // sign transaction with message and private key
    const [signature, recoveryBit] = await secp.sign(msgHash, privateKey, {
      recovered: true,
    });

    // convert signature to hex string for transmission
    const signatureHex = toHex(new Uint8Array(signature));

    const sender = accounts.find(
      (account) => account.keys.private === privateKey
    );
    const receiver = accounts.find((account) => account.address === recipient);

    try {
      // send transaction to server
      const res = await server.post(`send`, {
        signatureHex,
        recoveryBit,
        message,
      });

      const { data } = res;

      setBalances(data.balances);

      setTransactionStatus({
        msg: `${sender.name} sent ${sendAmount} tokens to ${receiver.name}!`,
        type: "success",
      });

      // reset form
      setSendAmount("");
      setRecipient("");
      setPrivateKey("");
    } catch (err) {
      console.log("err", err);
      setTransactionStatus({
        msg: `${sender.name} has less than ${sendAmount} tokens!`,
        type: "error",
      });
    }
  }

  const statusStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
  };

  return (
    <form
      className="border-black border-4 p-5 rounded h-full"
      onSubmit={transfer}
    >
      <h1 className="font-cubano text-5xl mb-5">Sign & Send Transaction</h1>
      <p className="font-gothic text-xl mb-5">
        The sender signs the transaction with their private key and the
        resulting signature is sent from the client to the node where the public
        key can be derived from the signature.
      </p>
      <div className="mb-7">
        <div className="mb-1">
          <label className="font-cubano text-3xl ml-2">Sender</label>
        </div>
        <div>
          <select
            className="p-2 border-2 border-black rounded font-gothic w-full text-2xl cursor-pointer bg-white"
            value={privateKey}
            onChange={setValue(setPrivateKey)}
            required
          >
            <option value="" disabled>
              {" "}
              Choose a wallet address
            </option>
            {accounts.map((account) => (
              <option key={account.address} value={account.keys.private}>
                {account.name} - {account.address}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-7">
        <div className="mb-1">
          <label className="font-cubano text-3xl ml-2">Amount</label>
        </div>
        <div>
          <input
            className="p-2 border-2 border-black rounded font-gothic w-full text-2xl"
            placeholder="Must not exceed the senders' wallet balance"
            value={sendAmount}
            onChange={setValue(setSendAmount)}
            required
          />
        </div>
      </div>
      <div className="mb-10">
        <div className="mb-1">
          <label className="font-cubano text-3xl ml-2">Recipient</label>
        </div>
        <div>
          <select
            className="p-2 border-2 border-black rounded font-gothic w-full text-2xl cursor-pointer bg-white"
            value={recipient}
            onChange={setValue(setRecipient)}
            required
          >
            <option value="" disabled>
              Choose wallet address
            </option>
            {accounts.map((account) => (
              <option key={account.address} value={account.address}>
                {account.name} - {account.address}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-4 justify-end">
        {transactionStatus && (
          <div
            className={`flex-grow border px-4 py-3 rounded font-cubano text-2xl ${
              statusStyles[transactionStatus.type]
            }}`}
            role="alert"
          >
            <p>{transactionStatus.msg}!</p>
          </div>
        )}
        <button
          type="submit"
          className="px-6 py-3 bg-dark font-cubano text-2xl text-white rounded"
        >
          Send
        </button>
      </div>
    </form>
  );
}

export default Transfer;
