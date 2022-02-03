import { useState } from 'react'
import logo from './logo.svg'
import './App.css'

import { ethers } from 'ethers'

const App = () => {
  const [account,setAccount] = useState()

  const Metamask = async() => {
    if(!window.ethereum) {
      console.log("error")
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      window.ethereum.enable()
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      setAccount(address)
      console.log({signer})
      console.log({address})
      const signature = await signer.signMessage('gm');
      console.log({signature})
    }
  }
  return (
    <div className="App">
      <button onClick={() => Metamask()}>
        Connect to Metamask</button>
      {account && <p>{account}</p>}
    </div>
  )
}

export default App
