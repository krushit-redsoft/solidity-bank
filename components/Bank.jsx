import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState, useMemo, useCallback } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers";
import { useForm } from 'react-hook-form';
import Fund from "./Fund";
import Transfer from "./Transfer";
import Withdraw from "./Withdraw";

export default function Bank() {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
  // These get re-rendered every time due to our connect button!
  const chainId = parseInt(chainIdHex)
  // console.log(`ChainId is ${chainId}`)
  const bankAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  // const address = await signer.getAddress();

  // State hooks
  const [account, setAccount] = useState({
    firstName: "",
    lastName: "",
    age: "",
    balance: "0.1",
  });
  const [hasAccount, setHasAccount] = useState(false);
  const [entranceFee, setEntranceFee] = useState("0");
  const [numberOfPlayers, setNumberOfPlayers] = useState("0")
  const [recentWinner, setRecentWinner] = useState("0")
  const [wallet, setWallet] = useState('');
  const [activeTab, setActiveTab] = useState("withdraw");

  const { register, handleSubmit, errors } = useForm({ mode: 'onBlur', reValidateMode: 'onChange' });

  const dispatch = useNotification()

  // const {
  //   runContractFunction: createAccount,
  //   data: enterTxResponse,
  //   isLoading,
  //   isFetching,
  // } = useWeb3Contract({
  //   abi: abi,
  //   contractAddress: bankAddress,
  //   functionName: "createAccount",
  //   msgValue: entranceFee,
  //   params: account,
  // })

  const provider = useMemo(() => new ethers.providers.Web3Provider(window.ethereum), []);
  const signer = useMemo(() => provider.getSigner(), [provider]);
  const contract = useMemo(() => new ethers.Contract(bankAddress, abi, signer), [bankAddress, signer]);

  /* View Functions */
  const accountCall = useCallback(async () => {
    if (hasAccount) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(bankAddress, abi, signer);
        const account = await contract.getPersonalInfo();
        console.log("account", account);
        setAccount({
          firstName: account[0],
          lastName: account[1],
          age: parseInt(account[2].toString(), 10),
          balance: ethers.utils.formatEther(account[3]),
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [hasAccount, bankAddress]);

  const accountExistsCall = useCallback(async (walletParam) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(bankAddress, abi, signer);
    const checkWallet = walletParam || wallet;
    if (checkWallet) {
      const accountExists = await contract.userExists(checkWallet);
      console.log("accountExists", accountExists);
      setHasAccount(accountExists);
      accountCall();
    }
  }, [wallet, accountCall, bankAddress]);

  useEffect(() => {
    if (isWeb3Enabled) {
      accountExistsCall();
      accountCall();
    }
  }, [isWeb3Enabled, accountExistsCall, accountCall]);
  // no list means it'll update everytime anything changes or happens
  // empty list means it'll run once after the initial rendering
  // and dependencies mean it'll run whenever those things in the list change

  // An example filter for listening for events, we will learn more on this next Front end lesson
  // const filter = {
  //     address: raffleAddress,
  //     topics: [
  //         // the name of the event, parnetheses containing the data type of each event, no spaces
  //         utils.id("RaffleEnter(address)"),
  //     ],
  // }


  useEffect(() => {
    async function connect() {
      try {
        // Connect to Ethereum using the Metamask provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Get the user's Ethereum address
        const signer = provider.getSigner();
        const wallet = await signer.getAddress();
        setWallet(wallet);

        // Check if the user has an account
        const accountExists = await contract.userExists(wallet);
        setHasAccount(accountExists);
        console.log('account exists ,', accountExists);
        if (accountExists) {
          await accountCall();
        }
      } catch (error) {
        console.log(error);
      }
    }
    connect();
  }, [contract, accountCall]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleNewNotification = (message, error = false) => {
    dispatch({
      type: error || "info",
      message: message || "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    })
  }

  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1)
      console.log(tx);
      handleNewNotification()
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmit = async (data) => {
    console.log(data);

    const value = ethers.utils.parseEther(data.balance);
    console.log(value);
    try {
      const tx = await contract.storePersonalInfo(data.firstName, data.lastName, data.age, { value });
      console.log(tx);
      handleSuccess(tx);
    } catch (error) {
      handleNewNotification(error.message, true);
    }
  }

  const handleFundAccount = async (data) => {
    console.log(data);
    const value = ethers.utils.parseEther(data.amount);
    console.log(value);
    try {
      const tx = await contract.deposit({ value });
      console.log(tx);
      handleSuccess(tx);
    } catch (error) {
      handleNewNotification(error.message, true);
    }
  }

  const handleWithdraw = async (data) => {
    console.log(data);
    const value = ethers.utils.parseEther(data.amount);
    console.log(value);
    try {
      const tx = await contract.withdraw(value);
      console.log(tx);
      handleSuccess(tx);
    } catch (error) {
      handleNewNotification(error.message, true);
    }
  }

  const handleTransfer = async (data) => {
    console.log(data);
    const value = ethers.utils.parseEther(data.amount);
    console.log(value);
    try {
      const tx = await contract.transfer(data.recipient, value);
      console.log(tx);
      handleSuccess(tx);
    } catch (error) {
      handleNewNotification(error.message, true);
    }
  }


  return (
    <div className="p-5 w-1/2">
      {hasAccount ? (
        <div className="">
          <div className="w-full max-w-md mx-7 rounded-lg overflow-hidden shadow-md bg-white">
            <div className="px-6 py-4 bg-indigo-600">
              <div className="text-white font-bold text-xl mb-2">
                {account.firstName} {account.lastName}
              </div>
              <div className="text-white font-bold text-lg">
                {account.balance} ETH
              </div>
            </div>
            <div className="bg-gray-100 px-6 py-4">
              <div className="text-gray-600 font-bold">Age</div>
              <div className="text-gray-900 text-2xl">{account.age}</div>
            </div>
          </div>

          <div className="max-w-8xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6 ">
              <div className="w-full flex flex-col sm:flex-row">
                <div className="sm:w-1/4">
                  <div className="flex flex-col space-y-1">
                    <button
                      className={`${activeTab === "withdraw" ? "bg-gray-100" : "bg-white"
                        } group flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900`}
                      onClick={() => handleTabClick("withdraw")}
                    >
                      <svg
                        className={`${activeTab === "withdraw" ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"
                          } mr-3 h-6 w-6`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span>Withdraw</span>
                    </button>

                    <button
                      className={`${activeTab === "transfer" ? "bg-gray-100" : "bg-white"
                        } group flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900`}
                      onClick={() => handleTabClick("transfer")}
                    >
                      <svg
                        className={`${activeTab === "transfer" ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"
                          } mr-3 h-6 w-6`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Transfer</span>
                    </button>

                    <button
                      className={`${activeTab === "deposit" ? "bg-gray-100" : "bg-white"
                        } group flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900`}
                      onClick={() => handleTabClick("deposit")}
                    >
                      <svg
                        className={`${activeTab === "deposit" ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"
                          } mr-3 h-6 w-6`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v8" />
                      </svg>
                      <span>Deposit</span>
                    </button>
                  </div>
                </div>
                <div className="sm:w-3/4">
                  {activeTab === "withdraw" && <Withdraw
                    handleWithdraw={handleWithdraw}
                    balance={account.balance}
                  />}
                  {activeTab === "transfer" && <Transfer
                    handleTransfer={handleTransfer}
                    balance={account.balance}
                  />}
                  {activeTab === "deposit" && <Fund
                    handleFundAccount={handleFundAccount}
                    balance={account.balance}
                  />}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (<>
        {/* button for creating account.  */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="md:flex">
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  First Name
                </div>
                <input
                  className="w-full mt-1 text-gray-900 text-2xl font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                  type="text"
                  name="firstName"
                  {...register("firstName", { required: true })}
                />
                {errors?.firstName && (
                  <span className="text-red-500">This field is required</span>
                )}

                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mt-4">
                  Last Name
                </div>
                <input
                  className="w-full mt-1 text-gray-900 text-2xl font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                  name="lastName"
                  {...register("lastName", { required: true })}
                />
                {errors?.lastName && (
                  <span className="text-red-500">This field is required</span>
                )}

                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mt-4">
                  Age
                </div>
                <input
                  className="w-full mt-1 text-gray-900 text-2xl font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                  name="age"
                  type="number"
                  {...register("age", { required: true, min: 18 })}
                />
                {errors?.age?.type === 'required' && (
                  <span className="text-red-500">This field is required</span>
                )}
                {errors?.age?.type === 'min' && (
                  <span className="text-red-500">
                    You must be at least 18 years old
                  </span>
                )}

                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mt-4">
                  Account Crypto Balance
                </div>
                <input
                  className="w-full mt-1 text-gray-900 text-2xl font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                  name="balance"
                  type="text"
                  step="0.000000000000000001"
                  {...register("balance", { required: true, min: 0 })}
                />
                {errors?.balance?.type === 'required' && (
                  <span className="text-red-500">This field is required</span>
                )}
                {errors?.balance?.type === 'min' && (
                  <span className="text-red-500">Balance must be at least 0</span>
                )}
              </div>
            </div>
          </div>

          <button
            className="mt-4 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            type="submit"
          >
            Create Account
          </button>
        </form>
      </>
      )}

    </div>
  )
}