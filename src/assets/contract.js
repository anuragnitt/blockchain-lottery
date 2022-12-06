import Web3 from 'web3';

const deployedContract = '0x6BfB87Aa8EcEEeb639006db86EF661B737E2dDB8';
const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "_comment",
				"type": "string"
			}
		],
		"name": "Action",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_comment",
				"type": "string"
			}
		],
		"name": "Transaction",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_slotNum",
				"type": "uint256"
			}
		],
		"name": "buySlot",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "checkOwner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "config",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "minProfitPercent",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "maxProfitPercent",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "minSlots",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxSlots",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "minSlotPrice",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "destroy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "onConnect",
		"outputs": [
			{
				"components": [
					{
						"components": [
							{
								"internalType": "uint8",
								"name": "minProfitPercent",
								"type": "uint8"
							},
							{
								"internalType": "uint8",
								"name": "maxProfitPercent",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "minSlots",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "maxSlots",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "minSlotPrice",
								"type": "uint256"
							}
						],
						"internalType": "struct cryptoLottery.lotteryConfig",
						"name": "config",
						"type": "tuple"
					},
					{
						"internalType": "uint256[]",
						"name": "filledSlots",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256",
						"name": "totalSlots",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "slotPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "prevWinnerSlot",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "open",
						"type": "bool"
					},
					{
						"internalType": "uint8",
						"name": "profitPercent",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "prevWinnerAddress",
						"type": "address"
					}
				],
				"internalType": "struct cryptoLottery.connectResponse",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "session",
		"outputs": [
			{
				"internalType": "bool",
				"name": "open",
				"type": "bool"
			},
			{
				"internalType": "uint8",
				"name": "profitPercent",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "winnerAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "totalSlots",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "slotPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "winnerSlot",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint8",
						"name": "minProfitPercent",
						"type": "uint8"
					},
					{
						"internalType": "uint8",
						"name": "maxProfitPercent",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "minSlots",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "maxSlots",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "minSlotPrice",
						"type": "uint256"
					}
				],
				"internalType": "struct cryptoLottery.lotteryConfig",
				"name": "_config",
				"type": "tuple"
			}
		],
		"name": "setConfig",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint8",
						"name": "profitPercent",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "totalSlots",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "slotPrice",
						"type": "uint256"
					}
				],
				"internalType": "struct sessionParams",
				"name": "_params",
				"type": "tuple"
			}
		],
		"name": "startLottery",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stopLottery",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];

export const web3 = new Web3(window.ethereum);
export const cryptoLottery = new web3.eth.Contract(abi, deployedContract);

cryptoLottery.handleRevert = true;
