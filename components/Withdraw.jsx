import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const Withdraw = ({ balance, handleWithdraw }) => {
  // const [amount, setAmount] = useState(0);
  const { register, handleSubmit, errors, control } = useForm({ mode: 'onBlur', reValidateMode: 'onChange' });

  // const handleWithdraw = (event) => {
  //   event.preventDefault();
  //   if (amount > balance) {
  //     alert('You do not have enough funds to withdraw that amount');
  //     return;
  //   }
  //   setAmount(0);
  // };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="p-8 w-full">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Withdraw Funds
          </div>
          <form onSubmit={handleSubmit(handleWithdraw)}>
            <div className="mt-4">
              <label className="block text-gray-700 font-semibold" htmlFor="amount">
                Amount
              </label>
              <input
                className="w-full mt-1 text-gray-900 text-lg font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                type="number"
                step="0.000000000000000001"
                control={control}
                {...register("amount", { required: true, min: 0, max: balance })}
                required
              />
              {errors?.amount?.type === 'required' && (
                <span className="text-red-500">This field is required</span>
              )}
              {errors?.amount?.type === 'min' && (
                <span className="text-red-500">amount must be at least 0</span>
              )}
              {errors?.amount?.type === 'max' && (
                <span className="text-red-500">amount should be less then {balance}</span>
              )}
            </div>
            <button
              className="mt-4 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              type="submit"
            >
              Withdraw
            </button>
          </form>
          <div className="mt-4">
            <p className="text-gray-700 font-semibold">Current Balance:</p>
            <p className="mt-1 text-gray-900 text-lg font-bold">
              {balance} ETH
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;