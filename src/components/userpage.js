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

    const [startButtonDisabled, setStartButtonDisabled] = useState(false);
    const [withdrawButtonDisabled, setWithdrawButtonDisabled] = useState(false);
    const [buyButtonDisabled, setBuyButtonDisabled] = useState(false);

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
                                session.totalSlots > 0 ? (
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

                            <div style={{ marginTop: '30px', marginBottom: '40px' }}>
                                <a className="courier-new">Account Balance:</a> <a className="success-green">{toEther(accountBalance)} ETH</a>
                                <br/>
                                <a className="courier-new">Contract Balance:</a> <a className="success-green">{toEther(contractBalance)} ETH</a>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ paddingRight: '20px' }}>
                                    <ValidationTextField
                                        label="Total Slots"
                                        variant="outlined"
                                        sx={TextFieldSX}
                                        onChange={(text) => {
                                            if (/^\d+$/.test(text)) {
                                                const s = Number(text);
                                                return (
                                                    s >= Number(session.config.minSlots) &&
                                                    s <= Number(session.config.maxSlots)
                                                );
                                            }
                                            return false;
                                        }}
                                        inputRef={totalSlotsRef}
                                        errorMessage={"Slots: " + session.config.minSlots + " - " + session.config.maxSlots}
                                        setDisabled={setStartButtonDisabled}
                                    />
                                </div>
                                <div style={{ paddingRight: '20px' }}>
                                    <ValidationTextField
                                        label="Slot Price (ETH)"
                                        variant="outlined"
                                        sx={TextFieldSX}
                                        onChange={(text) => {
                                            if (/^(\d+(\.\d+)?)$/.test(text)) {
                                                const sp = Number(web3.utils.toWei(text, 'ether'));
                                                return sp >= Number(session.config.minSlotPrice);
                                            }
                                            return false;
                                        }}
                                        inputRef={slotPriceRef}
                                        errorMessage={"Minimum price: " + toEther(session.config.minSlotPrice) + " ETH"}
                                        setDisabled={setStartButtonDisabled}
                                    />
                                </div>
                                <div style={{ paddingRight: '20px' }}>
                                    <ValidationTextField
                                        label="Profit (%)"
                                        variant="outlined"
                                        sx={TextFieldSX}
                                        onChange={(text) => {
                                            if (/^\d+$/.test(text)) {
                                                const p = Number(text);
                                                return (
                                                    p >= Number(session.config.minProfitPercent) &&
                                                    p <= Number(session.config.maxProfitPercent)
                                                );
                                            }
                                            return false;
                                        }}
                                        inputRef={profitRef}
                                        errorMessage={"Profit: " + session.config.minProfitPercent + " - " + session.config.maxProfitPercent + "%"}
                                        setDisabled={setStartButtonDisabled}
                                    />
                                </div>
                                <div style={{ paddingRight: '20px' }}>
                                    <span style={{cursor: startButtonDisabled ? 'not-allowed' : 'auto'}}>
                                        <LoadingButton
                                            variant="contained"
                                            onClick={() => {
                                                startLottery({
                                                    totalSlots: Number(totalSlotsRef.current.value).toString(),
                                                    slotPrice: web3.utils.toWei(Number(slotPriceRef.current.value).toString(), 'ether'),
                                                    profitPercent: Number(profitRef.current.value).toString()
                                                }, account);
                                            }}
                                            style={{ pointerEvents: startButtonDisabled ? 'none' : 'auto' }}
                                        >
                                            START
                                        </LoadingButton>
                                    </span>
                                </div>
                            </div>
                            
                            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ paddingRight: '20px' }}>
                                    <ValidationTextField 
                                        label="Amount (ETH)"
                                        variant="outlined"
                                        sx={TextFieldSX}
                                        onChange={(text) => {
                                            if (/^(\d+(\.\d+)?)$/.test(text)) {
                                                const w = Number(web3.utils.toWei(text, 'ether'));
                                                return w > 0 && w <= Number(contractBalance);
                                            }
                                            return false;
                                        }}
                                        inputRef={withdrawRef}
                                        errorMessage="Insufficient contract balance"
                                        setDisabled={setWithdrawButtonDisabled}
                                    />
                                </div>
                                <div>
                                    <span style={{ cursor: withdrawButtonDisabled ? 'not-allowed' : 'auto' }}>
                                        <LoadingButton
                                            variant="contained"
                                            onClick={() => {
                                                withdrawFromContract(
                                                    web3.utils.toWei(Number(withdrawRef.current.value).toString()),
                                                    account
                                                );
                                            }}
                                            style={{ pointerEvents: withdrawButtonDisabled ? 'none' : 'auto' }}
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

                            <div style={{ marginTop: '30px', marginBottom: '40px' }}>
                                <a className="courier-new">Account Balance:</a> <a className="success-green">{toEther(accountBalance)} ETH</a>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ paddingRight: '20px' }}>
                                    <ValidationTextField
                                        label="Slot Number"
                                        variant="outlined"
                                        sx={TextFieldSX}
                                        onChange={(text) => {
                                            if (/^\d+$/.test(text)) {
                                                const sn = Number(text);
                                                return (
                                                    Number(accountBalance) >= Number(session.slotPrice) &&
                                                    sn >= 1 &&
                                                    sn <= Number(session.totalSlots) &&
                                                    session.filledSlots.length < session.totalSlots &&
                                                    !session.filledSlots.includes(text)
                                                );
                                            }
                                            return false;
                                        }}
                                        inputRef={slotNumRef}
                                        errorMessage={Number(accountBalance) < Number(session.slotPrice) ? "Insufficient account balance" : "Slot unavailable"}
                                        setDisabled={setBuyButtonDisabled}
                                    />
                                </div>
                                <div>
                                    <span style={{ cursor: buyButtonDisabled ? 'not-allowed' : 'auto' }}>
                                        <LoadingButton
                                            variant="contained"
                                            onClick={() => {
                                                buySlot(
                                                    Number(slotNumRef.current.value).toString(),
                                                    session.slotPrice,
                                                    account
                                                );
                                            }}
                                            style={{ pointerEvents: buyButtonDisabled ? 'none' : 'auto' }}
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
                                session.totalSlots > 0 ? (
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
