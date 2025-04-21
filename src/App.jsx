import { useState } from "react";
import Web3 from "web3";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";

const ADDRESS = "0x80D0cc0695127FA57b2031bC10f2Db589B249131";

const ABI = [
  {
    inputs: [],
    name: "donate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
  {
    inputs: [],
    name: "balance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

function App() {
  const [balance, setBalance] = useState("0");
  const [donateAmount, setDonateAmount] = useState("");
  const web3 = new Web3(window.ethereum);
  const myContract = new web3.eth.Contract(ABI, ADDRESS);

  async function connectWallet() {
    try {
      toast.loading("Connecting wallet...");
      const accounts = await web3.eth.requestAccounts();
      toast.dismiss();
      toast.success("Wallet connected!");
      return accounts[0];
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to connect wallet.");
    }
  }

  async function donate() {
    try {
      if (!donateAmount || isNaN(donateAmount)) {
        toast.error("Enter a valid donation amount.");
        return;
      }

      toast.loading("Processing donation...");
      const sender = await connectWallet();
      const receipt = await myContract.methods.donate().send({
        from: sender,
        value: web3.utils.toWei(donateAmount, "ether"),
      });

      toast.dismiss();
      toast.success("Donation successful!");
      console.log("Transaction Receipt:", receipt);
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error("Donation failed!");
    }
  }

  async function withdraw() {
    try {
      toast.loading("Processing withdrawal...");
      const sender = await connectWallet();
      const receipt = await myContract.methods.withdraw().send({
        from: sender,
      });
      toast.dismiss();
      toast.success("Withdrawal successful!");
      console.log("Withdrawal Receipt:", receipt);
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error("Withdrawal failed!");
    }
  }

  async function getBalance() {
    try {
      toast.loading("Fetching balance...");
      const result = await myContract.methods.balance().call();
      setBalance(web3.utils.fromWei(result, "ether"));
      toast.dismiss();
      toast.success("Balance updated!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to fetch balance.");
      console.error(error);
    }
  }

  return (
    <div className="App">
      <Toaster position="top-right" />
      <header className="App-header">
        
        <h1>🦊 Donation Dapp</h1>
        <input
          type="number"
          value={donateAmount}
          onChange={(e) => setDonateAmount(e.target.value)}
          placeholder="Enter ETH amount"
          className="input"
        />
        <div className="button-group">
          <button onClick={connectWallet}>Connect Wallet</button>
          <button onClick={donate}>Donate</button>
          <button onClick={withdraw}>Withdraw</button>
          <button onClick={getBalance}>Check Balance</button>
        </div>
        <p>📦 Contract Balance: <strong>{balance || "0"} ETH</strong></p>
      </header>
    </div>
  );
}

export default App;
