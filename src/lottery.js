import { useState } from 'react';
import { WalletConnect } from './components/walletconnect';
import './styles/app.css';
import './styles/lottery.css';

export const Lottery = () => {

  const [account, setAccount] = useState("");

  return (
    <div className="app">
      <header className="app-header">
        {
          window.ethereum === undefined ? (
            <div className="fail-red">
              MetaMask not detected.
              <br/>
              Please try again from a MetaMask enabled browser.
            </div>
          ) : (
            <WalletConnect
              account={account}
              setAccount={setAccount}
            />
          )
        }
      </header>
    </div>
  );
}

export default Lottery;
