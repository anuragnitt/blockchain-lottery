import { useEffect } from 'react';
import { web3 } from '../assets/contract';
import { ContractInteract } from './contractinteract';

export const WalletConnect = (props) => {

    useEffect(() => {
        window.ethereum.on("chainChanged", () => {
            window.location.reload();
        });
        window.ethereum.on("accountsChanged", () => {
            window.location.reload();
        });
        web3.eth.requestAccounts().then((accounts) => {
            props.setAccount(accounts[0]);
        });
    }, []);

    return (
        <ContractInteract
            account={props.account}
        />
    );
}

export default WalletConnect;
