import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const Transfer = ({ balance, handleTransfer }) => {
  const { register, handleSubmit, errors, control } = useForm({ mode: 'onBlur', reValidateMode: 'onChange' });

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="p-8 w-full">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Transfer ETH
          </div>
          <form onSubmit={handleSubmit(handleTransfer)}>
            <div className="mt-4 w-full">
              <label className="block text-gray-700 font-semibold" htmlFor="recipient">
                Recipient
              </label>
              <input
                className="w-full mt-1 text-gray-900 text-lg border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                type="text"
                {...register("recipient", { required: true, min: 0, maxLength: 42, minLength: 42, pattern: /^0x[a-fA-F0-9]{40}$/ })}
                control={control}
                required
              />
              {errors?.recipient && (
                <span className="text-red-500">This field is required</span>
              )}
              {errors?.recipient?.type === "minLength" && (
                <span className="text-red-500">Address must be 42 characters long</span>
              )}
              {errors?.recipient?.type === "maxLength" && (
                <span className="text-red-500">Address must be 42 characters long</span>
              )}
              {errors?.recipient?.type === "pattern" && (
                <span className="text-red-500">Address must be a valid Ethereum address</span>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 font-semibold" htmlFor="amount">
                Amount
              </label>
              <input
                className="w-full mt-1 text-gray-900 text-lg font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                type="number"
                step="0.000000000000000001"
                {...register("amount", { required: true, min: 0, max: balance })}
                control={control}
                required
              />
              {errors?.amount && (
                <span className="text-red-500">This field is required</span>
              )}
              {errors?.amount?.type === "min" && (
                <span className="text-red-500">Amount must be greater than 0</span>
              )}
              {errors?.amount?.type === "max" && (
                <span className="text-red-500">Amount must be less than your balance</span>
              )}
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