import React, { useState } from 'react';

const Transfer = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);

  const handleTransfer = (event) => {
    event.preventDefault();
    console.log(`Transferring ${amount} ETH to ${recipient}`);
    setAmount(0);
    setRecipient('');
  };

  const handleRecipientChange = (event) => {
    setRecipient(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Transfer ETH
          </div>
          <form onSubmit={handleTransfer}>
            <div className="mt-4">
              <label className="block text-gray-700 font-semibold" htmlFor="recipient">
                Recipient
              </label>
              <input
                className="w-full mt-1 text-gray-900 text-lg font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                type="text"
                value={recipient}
                onChange={handleRecipientChange}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 font-semibold" htmlFor="amount">
                Amount
              </label>
              <input
                className="w-full mt-1 text-gray-900 text-lg font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                type="number"
                step="0.000000000000000001"
                value={amount}
                onChange={handleAmountChange}
                required
              />
            </div>
            <button
              className="mt-4 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              type="submit"
            >
              Transfer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Transfer;