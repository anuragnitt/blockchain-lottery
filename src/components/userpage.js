import { useState, useRef } from 'react';
import { LoadingButton } from '@mui/lab';
import { withdrawFromContract, startLottery, stopLottery, buySlot } from '../assets/transactions';
import { ValidationTextField } from './validationtextfield';
import { toEther, TextFieldSX } from '../assets/utils';
import { web3 } from '../assets/contract';

export const UserPage = (props) => {
    const account = props.account;
    const owner = props.owner;
    const session = props.session;
    const accountBalance = props.accountBalance;
    const contractBalance = props.contractBalance;

    const [totalSlotsValid, setTotalSlotsValid] = useState(false);
    const [slotPriceValid, setSlotPriceValid] = useState(false);
    const [profitValid, setProfitValid] = useState(false);
    const [withdrawAmountValid, setWithdrawAmountValid] = useState(false);
    const [buyAmountValid, setBuyAmountValid] = useState(false);

    const totalSlotsRef = useRef('');
    const slotPriceRef = useRef('');
    const profitRef = useRef('');
    const withdrawRef = useRef('');
    const slotNumRef = useRef('');

    if (session === null) {
        return (
            <div/>
        );
    } else if (owner) {
        return (
            <div>
                <a className="courier-new">Lottery Status:</a>
                {
                    session.open ? (
                        <a className="success-green"> OPEN</a>
                    ) : (
                        <a className="fail-red"> CLOSED</a>
                    )
                }
                {
                    session.open ? (
                        <div>
                            <div>
                                <a className="courier-new">Total Slots:</a> <a className="success-green">{session.totalSlots}</a>
                                <br/>
                                <a className="courier-new">Slots Sold:</a> {
                                    session.filledSlots.length === 0 ? (
                                        <a className="fail-red">None</a>
                                    ) : (
                                        <a className="success-green">
                                            ({session.filledSlots.length}) {session.filledSlots.join(', ')}
                                        </a>
                                    )
                                }
                                <br/>
                                <a className="courier-new">Slot Price:</a> <a className="success-green">{toEther(session.slotPrice)} ETH</a>
                                <br/>
                                <a className="courier-new">Take Home:</a> <a className="success-green">{session.profitPercent}% of Pool</a>
                            </div>
                            <div style={{ marginTop: '40px' }}>
                                <LoadingButton
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                        stopLottery(account);
                                    }}
                                >
                                    STOP
                                </LoadingButton>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {
                                Number(session.totalSlots) > 0 ? (
                                    <div>
                                        <a className="courier-new">Total Slots:</a> <a className="success-green">{session.totalSlots}</a>
                                        <br/>
                                        <a className="courier-new">Slots Sold:</a> {
                                            session.filledSlots.length === 0 ? (
                                                <a className="fail-red">None</a>
                                            ) : (
                                                <a className="success-green">
                                                    ({session.filledSlots.length}) {session.filledSlots.join(', ')}
                                                </a>
                                            )
                                        }
                                        <br/>
                                        <a className="courier-new">Slot Price:</a> <a className="success-green">{toEther(session.slotPrice)} ETH</a>
                                        <br/>
                                        <a className="courier-new">Take Home:</a> <a className="success-green">{session.profitPercent}% of Pool</a>
                                        <div style={{ marginTop: '30px' }} />
                                        <a className="courier-new">Winner Slot:</a> <a className="success-green">{session.prevWinnerSlot}</a>
                                        <br/>
                                        <a className="courier-new">Winner Address:</a> <a className="success-green">{session.prevWinnerAddress}</a>
                                    </div>
                                ) : (
                                    <div className="fail-red">No lottery has happened yet</div>
                                )
                            }

                            <div className="balance-container">
                                <a className="courier-new">Account Balance:</a> <a className="success-green">{toEther(accountBalance)} ETH</a>
                                <br/>
                                <a className="courier-new">Contract Balance:</a> <a className="success-green">{toEther(contractBalance)} ETH</a>
                            </div>

                            <div className="text-field-container">
                                <div className="text-field">
                                    <ValidationTextField
                                        label="Total Slots"
                                        variant="outlined"
                                        sx={TextFieldSX}
                                        onChange={(text) => {
                                            if (/^\d+$/.test(text)) {
                                                const slots = Number(text);
                                                return (
                                                    slots >= Number(session.config.minSlots) &&
                                                    slots <= Number(session.config.maxSlots)
                                                );
                                            }
                                            return false;
                                        }}
                                        inputRef={totalSlotsRef}
                                        errorMessage={"Slots: " + session.config.minSlots + " - " + session.config.maxSlots}
                                        setEntityValid={setTotalSlotsValid}
                                    />
                                </div>
                                <div className="text-field">
                                    <ValidationTextField
                                        label="Slot Price (ETH)"
                                        variant="outlined"
                                        sx={TextFieldSX}
                                        onChange={(text) => {
                                            if (/^(\d+(\.\d+)?)$/.test(text)) {
                                                return Number(web3.utils.toWei(text, 'ether')) >= Number(session.config.minSlotPrice);
                                            }
                                            return false;
                                        }}
                                        inputRef={slotPriceRef}
                                        errorMessage={"Minimum price: " + toEther(session.config.minSlotPrice) + " ETH"}
                                        setEntityValid={setSlotPriceValid}
                                    />
                                </div>
                                <div className="text-field">
                                    <ValidationTextField
                                        label="Profit (%)"
                                        variant="outlined"
                                        sx={TextFieldSX}
                                        onChange={(text) => {
                                            if (/^\d+$/.test(text)) {
                                                const profit = Number(text);
                                                return (
                                                    profit >= Number(session.config.minProfitPercent) &&
                                                    profit <= Number(session.config.maxProfitPercent)
                                                );
                                            }
                                            return false;
                                        }}
                                        inputRef={profitRef}
                                        errorMessage={"Profit: " + session.config.minProfitPercent + " - " + session.config.maxProfitPercent + "%"}
                                        setEntityValid={setProfitValid}
                                    />
                                </div>
                                <div className="text-field">
                                    <span style={{cursor: (totalSlotsValid && slotPriceValid && profitValid) ? 'auto' : 'not-allowed'}}>
                                        <LoadingButton
                                            variant="contained"
                                            onClick={() => {
                                                startLottery({
                                                    totalSlots: totalSlotsRef.current.value,
                                                    slotPrice: web3.utils.toWei(slotPriceRef.current.value, 'ether'),
                                                    profitPercent: profitRef.current.value
                                                }, account);
                                            }}
                                            style={{ pointerEvents: (totalSlotsValid && slotPriceValid && profitValid) ? 'auto' : 'none' }}
                                        >
                                            START
                                        </LoadingButton>
                                    </span>
                                </div>
                            </div>
                            
                            <div className="text-field-container" style={{ marginTop: '30px' }}>
                                <div className="text-field">
                                    <ValidationTextField 
                                        label="Amount (ETH)"
                                        variant="outlined"
                                        sx={TextFieldSX}
                                        onChange={(amount) => {
                                            if (/^(\d+(\.\d+)?)$/.test(amount)) {
                                                const wei = Number(web3.utils.toWei(amount, 'ether'));
                                                return wei > 0 && wei <= Number(contractBalance);
                                            }
                                            return false;
                                        }}
                                        inputRef={withdrawRef}
                                        errorMessage="Insufficient contract balance"
                                        setEntityValid={setWithdrawAmountValid}
                                    />
                                </div>
                                <div>
                                    <span style={{ cursor: withdrawAmountValid ? 'auto' : 'not-allowed' }}>
                                        <LoadingButton
                                            variant="contained"
                                            onClick={() => {
                                                withdrawFromContract(
                                                    web3.utils.toWei(withdrawRef.current.value),
                                                    account
                                                );
                                            }}
                                            style={{ pointerEvents: withdrawAmountValid ? 'auto' : 'none' }}
                                        >
                                            WITHDRAW
                                        </LoadingButton>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    } else {
        return (
            <div>
                 <a className="courier-new">Lottery Status:</a> {
                    session.open ? (
                        <a className="success-green"> OPEN</a>
                    ) : (
                        <a className="fail-red"> CLOSED</a>
                    )
                }
                {
                    session.open ? (
                        <div>
                            <div>
                                <a className="courier-new">Total Slots:</a> <a className="success-green">{session.totalSlots}</a>
                                <br/>
                                <a className="courier-new">Slots Sold:</a> {
                                            session.filledSlots.length === 0 ? (
                                                <a className="fail-red">None</a>
                                            ) : (
                                                <a className="success-green">
                                                    ({session.filledSlots.length}) {session.filledSlots.join(', ')}
                                                </a>
                                            )
                                        }
                                <br/>
                                <a className="courier-new">Slot Price:</a> <a className="success-green">{toEther(session.slotPrice)} ETH</a>
                                <br/>
                                <a className="courier-new">Prize:</a> <a className="success-green">{(100 - Number(session.profitPercent)).toString()}% of Pool</a>
                            </div>

                            <div className="balance-container">
                                <a className="courier-new">Account Balance:</a> <a className="success-green">{toEther(accountBalance)} ETH</a>
                            </div>

                            <div className="text-field-container">
                                <div className="text-field">
                                    <ValidationTextField
                                        label="Slot Number"
                                        variant="outlined"
                                        sx={TextFieldSX}
                                        onChange={(text) => {
                                            if (/^\d+$/.test(text)) {
                                                const slot = Number(text);
                                                return (
                                                    Number(accountBalance) >= Number(session.slotPrice) &&
                                                    slot >= 1 &&
                                                    slot <= Number(session.totalSlots) &&
                                                    session.filledSlots.length < Number(session.totalSlots) &&
                                                    !session.filledSlots.includes(slot.toString())
                                                );
                                            }
                                            return false;
                                        }}
                                        inputRef={slotNumRef}
                                        errorMessage={accountBalance < session.slotPrice ? "Insufficient account balance" : "Slot unavailable"}
                                        setEntityValid={setBuyAmountValid}
                                    />
                                </div>
                                <div>
                                    <span style={{ cursor: buyAmountValid ? 'not-allowed' : 'auto' }}>
                                        <LoadingButton
                                            variant="contained"
                                            onClick={() => {
                                                buySlot(
                                                    slotNumRef.current.value,
                                                    session.slotPrice,
                                                    account
                                                );
                                            }}
                                            style={{ pointerEvents: buyAmountValid ? 'none' : 'auto' }}
                                        >
                                            BUY
                                        </LoadingButton>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ marginTop: '30px' }}>
                            {
                                Number(session.totalSlots) > 0 ? (
                                    <div>
                                        {
                                            session.prevWinnerSlot !== "0" ? (
                                                <div>
                                                    <a className="courier-new">Winner Slot:</a> <a className="success-green">{session.prevWinnerSlot}</a>
                                                    <br/>
                                                    <a className="courier-new">Winner Address:</a> <a className="success-green">{session.prevWinnerAddress}</a>
                                                </div>
                                            ) : (
                                                <div/>
                                            )
                                        }
                                    </div>
                                ) : (
                                    <div className="fail-red">No lottery has happened yet</div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        );
    }
}

export default UserPage;
