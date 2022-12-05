import { useState, useEffect } from 'react';
import { UserPage } from './userpage';
import { web3, cryptoLottery } from '../assets/contract';

export const ContractInteract = (props) => {
    const account = props.account;

    const [accountBalance, setAccountBalance] = useState("0");
    const [contractBalance, setContractBalance] = useState("0");
    const [owner, setOwner] = useState(false);
    const [session, setSession] = useState(null);

    useEffect(() => {
        try {
            cryptoLottery.methods.checkOwner(account).call().then((resp) => {
                setOwner(resp);
            });
            cryptoLottery.methods.onConnect().call().then((resp) => {
                setSession(resp);
            });
            web3.eth.getBalance(account).then((resp) => {
                setAccountBalance(resp);
            });
            cryptoLottery.methods.getBalance().call().then((resp) => {
                setContractBalance(resp);
            });
        } catch (err) {
            console.error(err);
        }
    }, [account])

    if (account === "") {
        return (
            <div className="fail-red">
                Please connect an account with MetaMask
            </div>
        )
    } else {
        return (
            <div>
                <a className="courier-new">My Address:</a> <a className="success-green">{account}</a>
                <div style={{ marginBottom: '30px' }} />
                <UserPage
                    account={account}
                    owner={owner}
                    session={session}
                    accountBalance={accountBalance}
                    contractBalance={contractBalance}
                />
            </div>
        );
    }
}

export default ContractInteract;
