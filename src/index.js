import ReactDOM from "react-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { DAppProvider } from '@usedapp/core'
import App from "./App";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
     <DAppProvider>
    <App />
    </DAppProvider>
  </Web3ReactProvider>,
  rootElement
);
