import { useState } from 'react';
import { Lottery } from './components/lottery';
import './styles/app.css';
import './styles/lottery.css';

export const CryptoLottery = () => {

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
            <Lottery
              account={account}
              setAccount={setAccount}
            />
          )
        }
      </header>
    </div>
  );
}

export default CryptoLottery;
