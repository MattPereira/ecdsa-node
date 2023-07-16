import Wallet from "./Wallets";
import Transfer from "./Transfer";
import server from "./server";
import ACCOUNTS from "./accounts";

import { useState, useEffect } from "react";

function App() {
  const [balances, setBalances] = useState(null);

  useEffect(() => {
    async function getBalances() {
      try {
        const { data } = await server.get(`balances`);
        console.log("data", data);

        setBalances(data);
      } catch (err) {
        console.log("error:", err);
      }
    }
    getBalances();
  }, []);

  if (!balances) return <div>Loading...</div>;

  return (
    <div className="app">
      <div className="p-5">
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
          <div>
            <Wallet balances={balances} accounts={ACCOUNTS} />
          </div>
          <div>
            <Transfer setBalances={setBalances} accounts={ACCOUNTS} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
