import React, { useState } from 'react';

const Fund = () => {
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);

  const handleFund = (event) => {
    event.preventDefault();
    setBalance(balance + Number(amount));
    setAmount(0);
  };

  const handleInputChange = (event) => {
    setAmount(event.target.value);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Fund Your Account
          </div>
          <form onSubmit={handleFund}>
            <div className="mt-4">
              <label className="block text-gray-700 font-semibold" htmlFor="amount">
                Amount
              </label>
              <input
                className="w-full mt-1 text-gray-900 text-lg font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                type="number"
                step="0.000000000000000001"
                value={amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <button
              className="mt-4 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              type="submit"
            >
              Fund
            </button>
          </form>
          <div className="mt-4">
            <p className="text-gray-700 font-semibold">Current Balance:</p>
            <p className="mt-1 text-gray-900 text-lg font-bold">
              {balance.toFixed(18)} ETH
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fund;