import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers";

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
  // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables
  const [account, setAccount] = useState({
    firstName: "krushit",
    lastName: "dudhat",
    age: "22",
    balance: "0.00001",
  });
  const [hasAccount, setHasAccount] = useState(true);
  const [entranceFee, setEntranceFee] = useState("0");
  const [numberOfPlayers, setNumberOfPlayers] = useState("0")
  const [recentWinner, setRecentWinner] = useState("0")
  const [wallet, setWallet] = useState('');
  const [activeTab, setActiveTab] = useState("withdraw");

  const dispatch = useNotification()

  const {
    runContractFunction: createAccount,
    data: enterTxResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: bankAddress,
    functionName: "createAccount",
    msgValue: entranceFee,
    params: account,
  })

  /* View Functions */

  const accountCall = async () => {
    // using ethers call accounts function to fetch account details
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(bankAddress, abi, signer);
    if (wallet) {
      const account = await contract.accounts(wallet);
      console.log(account);
      setAccount(account);
    }
  }
  const accountExistsCall = async () => {
    // using ethers call accounts function to fetch account details
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(bankAddress, abi, signer);
    if (wallet) {
      const accountExists = await contract.accountExists(wallet);
      console.log(accountExists);
      setHasAccount(accountExists);
      accountCall();
    }
  }


  async function updateUIValues() {
    // Another way we could make a contract call:
    // const options = { abi, contractAddress: raffleAddress }
    // const fee = await Moralis.executeFunction({
    //     functionName: "getEntranceFee",
    //     ...options,
    // })
    // const accountFromCall = await getAccount()
    // const accountExistsFromCall = await accountExists();
    // const accountFromCall = await accounts();
    // console.log(accountFromCall);
    // console.log(accountExistsFromCall);
    // setHasAccount(accountExistsFromCall);
    // setAccount(accountFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      accountExistsCall();
      accountCall();
      // updateUIValues()
    }
  }, [isWeb3Enabled, hasAccount])
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
      // Connect to Ethereum using the Metamask provider
      console.log(window.ethereum.selectedAddress);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Get the user's Ethereum address
      const signer = provider.getSigner();
      const wallet = await signer.getAddress();
      setWallet(wallet);
    }
    connect();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    })
  }

  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1)
      updateUIValues()
      handleNewNotification(tx)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(e);
  }

  return (
    <div className="p-5">
      {hasAccount ? (
        <>
          {/* card for user detial */}
          {/* <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div class="md:flex">
              <div class="p-8">
                <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">First Name</div>
                <p class="mt-1 text-gray-900 text-2xl font-bold">{account.firstName}</p>
                <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold mt-4">Last Name</div>
                <p class="mt-1 text-gray-900 text-2xl font-bold">{account.lastName}</p>
                <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold mt-4">Age</div>
                <p class="mt-1 text-gray-900 text-2xl font-bold">{account.age}</p>
                <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold mt-4">Account Crypto Balance</div>
                <p class="mt-1 text-gray-900 text-2xl font-bold">{ethers.utils.parseEther(account.balance || 0)}</p>
              </div>
            </div>
          </div> */}
          <div className="w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-md bg-white">
            <div className="px-6 py-4 bg-indigo-600">
              <div className="text-white font-bold text-xl mb-2">
                {account.firstName} {account.lastName}
              </div>
              <div className="text-white font-bold text-lg">
                ${account.balance}
              </div>
            </div>
            <div className="bg-gray-100 px-6 py-4">
              <div className="text-gray-600 font-bold">Age</div>
              <div className="text-gray-900 text-2xl">{account.age}</div>
            </div>
          </div>
          {/* <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="md:flex">
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  First Name
                </div>
                <p
                  className="w-full mt-1 text-gray-900 text-2xl font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                  type="text"
                  value={account.firstName}
                // onChange={(event) => setFirstName(event.target.value)}
                >{account.firstName} </p>
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mt-4">
                  Last Name
                </div>
                <p
                  className="w-full mt-1 text-gray-900 text-2xl font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                  type="text"
                  value={account.lastName}
                // onChange={(event) => setLastName(event.target.value)}
                />
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mt-4">Age</div>
                <p
                  className="w-full mt-1 text-gray-900 text-2xl font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                  type="number"
                  value={account.age}
                // onChange={(event) => setAge(event.target.value)}
                />
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mt-4">
                  Account Crypto Balance
                </div>
                <p
                  className="w-full mt-1 text-gray-900 text-2xl font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                  type="number"
                  step="0.000000000000000001"
                  value={account.balance}
                // onChange={(event) => setBalance(event.target.value)}
                />
              </div>
            </div>
          </div> */}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex flex-col sm:flex-row">
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
                  {activeTab === "withdraw" && <Withdraw />}
                  {activeTab === "transfer" && <Transfer />}
                  {activeTab === "deposit" && <Fund />}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (<>
          {/* button for creating account.  */}
          <form onSubmit={handleSubmit}>
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
              <div className="md:flex">
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                    First Name
                  </div>
                  <input
                    className="w-full mt-1 text-gray-900 text-2xl font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                    type="text"
                    value={account.firstName}
                    // onChange={(event) => setFirstName(event.target.value)}
                  />
                  <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mt-4">
                    Last Name
                  </div>
                  <input
                    className="w-full mt-1 text-gray-900 text-2xl font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                    type="text"
                    value={account.lastName}
                    // onChange={(event) => setLastName(event.target.value)}
                  />
                  <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mt-4">Age</div>
                  <input
                    className="w-full mt-1 text-gray-900 text-2xl font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                    type="number"
                    value={account.age}
                    // onChange={(event) => setAge(event.target.value)}
                  />
                  <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mt-4">
                    Account Crypto Balance
                  </div>
                  <input
                    className="w-full mt-1 text-gray-900 text-2xl font-bold border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                    type="number"
                    step="0.000000000000000001"
                    value={account.balance}
                    // onChange={(event) => setBalance(event.target.value)}
                  />
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