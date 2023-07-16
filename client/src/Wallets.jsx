function Wallets({ balances, accounts }) {
  return (
    <div className="border-4 border-black p-5 rounded wallet h-full">
      <h1 className="font-cubano text-5xl mb-5">Wallets & Balances</h1>

      {accounts.map((account) => (
        <div key={account.address} className={`mb-5 p-5 rounded`}>
          <div className="font-gothic text-2xl mb-1">
            <span className="font-cubano">Owner: </span> {account.name}
          </div>
          <div className="font-gothic text-2xl mb-1">
            <span className="font-cubano">address: </span>
            {account.address}
          </div>
          <div className="font-gothic text-2xl mb-1">
            <span className="font-cubano">balance: </span>
            {balances[account.address]}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Wallets;
