import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import React,{useState,useEffect} from 'react';
import { useEthers } from "@usedapp/core";

import Web3 from "web3";

const injected = new InjectedConnector({
  supportedChainIds: [56]
});

const walletconnect = new WalletConnectConnector({
  rpc: {
    1: "https://mainnet.infura.io/v3/00ca1859789d4b40bce01f4104844224",
    56: "https://bsc-dataseed.binance.org/"
  },
  network: "binance",
  qrcode: true,
  pollingInterval: 12000
});

export default function App() {
  const { account, activateBrowserWallet, library, active, activate,deactivate } = useEthers();
  const web3authSdk = window.Web3auth
  let web3AuthInstance = null;
  const [logout, setLogout] = useState(false);
  const [Account, setAccount] = useState(null);

  useEffect(() => {
    init()
    if(account){
      console.log({account})
    }
  }, [account])
  
  const init = async() => {
    web3AuthInstance = new web3authSdk.Web3Auth({
      chainConfig: { chainNamespace: "eip155" },
      clientId: "BGC1coVXrFJH8nE9cDou4PngZlPsfzXg91QenzdKSPI6aPd5yK8jlP3sR0kYOvccoqU_1N5bMKQ2tKhgMPrXm9Q" // get your clientId from https://dashboard.web3auth.io
  });
  subscribeAuthEvents(web3AuthInstance)
  await web3AuthInstance.initModal();
  console.log("web3AuthInstance", web3AuthInstance, web3AuthInstance.provider)
  if (web3AuthInstance.provider) {
      const user = await web3AuthInstance.getUserInfo();
      console.log("user", user)
      await initWeb3();
  } else {
      console.log("no provider")
  }
}


  function subscribeAuthEvents(web3auth) {
    web3auth.on("connected", (data) => {
        console.log("Yeah!, you are successfully logged in", data);

    })

    web3auth.on("connecting", () => {
        console.log("connecting");
    });

    web3auth.on("disconnected", () => {
        console.log("disconnected");
    });

    web3auth.on("errored", (error) => {
        console.log("some error or user have cancelled login request", error);
    });

    web3auth.on("MODAL_VISIBILITY", (isVisible) => {
        console.log("modal visibility", isVisible)
    });
}

console.log(Account)

async function initWeb3() {
    const web3 = new Web3(web3AuthInstance.provider);
    const address = (await web3.eth.getAccounts())[0];
    const balance = await web3.eth.getBalance(address);
    console.log(balance);
    console.log(address);
    setAccount(address);
}

const Login = async() => {
  try {
    const provider = await web3AuthInstance.connect()
    console.log("provider after login", provider)
    await initWeb3();
    const user = await web3AuthInstance.getUserInfo();
   console.log("user after login", user)
   activate(provider)
} catch (error) {
  console.log("error", error)
}
}
  const connectInjected = async () => {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  };

  const connectWalletConnect = async () => {
    try {
      await activate(walletconnect);
    } catch (ex) {
      console.log(ex);
    }
  };

  async function disconnect() {
    try {
      await web3AuthInstance.logout()
     
      console.log("disconnecting");
      setAccount(null)
      setLogout(true)
    } catch (ex) {
     
      console.log(ex);
    }
  }

  return (
    <div className="App">
      <div>Active: {active || Account ? "true" : "false"}</div>
      <div>Account: {account || Account ? account || Account : null}</div>
 
      <button onClick={connectInjected}>MetaMask</button>
      <button onClick={connectWalletConnect}>Wallet Connect</button>
      <button onClick={Login}>Web3Auth</button>
    

    </div>
  );
}
