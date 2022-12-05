// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./sessionMethods.sol";

contract cryptoLottery {

    struct lotteryConfig {
        uint8 minProfitPercent;
        uint8 maxProfitPercent;
        uint256 minSlots;
        uint256 maxSlots;
        uint256 minSlotPrice;
    }

    struct connectResponse {
        lotteryConfig config;
        uint256[] filledSlots;
        uint256 totalSlots;
        uint256 slotPrice;
        uint256 prevWinnerSlot;
        bool open;
        uint8 profitPercent;
        address prevWinnerAddress;
    }

    // structs always starts in a new slot
    lotteryConfig public config;
    lotterySession public session;
    using SessionMethods for lotterySession;

    address payable public owner;
    address payable public winnerAddress;
    uint256 public winnerSlot;

    // events with indexed arguments are stored in the 'topics' property
    // of logs and can be searched with filters
    event Transaction(address indexed _to, uint256 indexed _amount, string _comment);
    event Action(string _comment);

    constructor() {
        config.minSlots = 10;
        config.maxSlots = 1000;
        config.minSlotPrice = 0.005 ether;
        config.minProfitPercent = 20;
        config.maxProfitPercent = 50;

        owner = payable(msg.sender);
        winnerAddress = payable(address(this));
        winnerSlot = 0;
    }

    fallback() external payable {
        emit Transaction(msg.sender, msg.value, "Reverted call to fallback function");
        revert();
    }

    receive() external payable {
        emit Transaction(msg.sender, msg.value, "Money received on receive function");
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Must be the owner");
        _;
    }

    modifier lotteryOpen() {
        require(session.isOpen(), "Lottery session is closed");
        _;
    }

    modifier lotteryClosed() {
        require(session.isOpen() == false, "Lottery session is open");
        _;
    }

    function checkOwner(address _address) public view returns (bool) {
        return _address == owner;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // owner can withdraw amounts only when lottery is not open
    function withdraw(uint256 _amount) external onlyOwner lotteryClosed {
        require(_amount <= getBalance(), "Insufficient balance");

        (bool sent, ) = owner.call{value: _amount}("");
        require(sent, "Transfer to owner failed");

        emit Transaction(owner, _amount, "Money transferred on withdraw function");
    }

    // owner can transfer amounts only when lottery is not open
    function transfer(address payable _receiver, uint256 _amount) public onlyOwner lotteryClosed {
        require(_amount <= getBalance(), "Insufficient balance");

        (bool sent, ) = _receiver.call{value: _amount}("");
        require(sent, "Transfer failed");

        emit Transaction(_receiver, _amount, "Money transferred on transfer function");
    }

    // owner can be modified only when lottery is not open
    function transferOwnership(address payable _newOwner) external onlyOwner lotteryClosed {
        require(_newOwner != owner, "Cannot re-assign self");
        owner = _newOwner;

        emit Action("Contract owner changed");
    }

    function setConfig(lotteryConfig calldata _config) external onlyOwner {
        config.minSlots = _config.minSlots;
        config.maxSlots = _config.maxSlots;
        config.minSlotPrice = _config.minSlotPrice;
        config.minProfitPercent = _config.minProfitPercent;
        config.maxProfitPercent = _config.maxProfitPercent;

        emit Action("Lottery limits modified");
    }

    function startLottery(sessionParams calldata _params) external onlyOwner lotteryClosed {
        require(_params.totalSlots >= config.minSlots && _params.totalSlots <= config.maxSlots, "Invalid number of slots");
        require(_params.slotPrice >= config.minSlotPrice, "Invalid slot slotPrice");
        require(_params.profitPercent >= config.minProfitPercent && _params.profitPercent <= config.maxProfitPercent, "Invalid profit percentage");

        winnerSlot = 0;
        session.reset();
        session.start(_params);

        emit Action("Lottery session started");
    }

    // winner will be decided and paid automatically when lottery is closed
    function stopLottery(uint256 _randomVal) external onlyOwner lotteryOpen {
        session.stop();

        emit Action("Lottery session stopped");

        (uint256 winnerIndex, address _winnerAddress) = session.selectWinner(_randomVal);

        // if slots were sold
        if (_winnerAddress != address(0)) {
            winnerSlot = winnerIndex + 1;
            winnerAddress = payable(_winnerAddress);

            emit Action("Lottery winner announced");

            uint256 sessionBalance = session.getBalance();
            uint256 lotteryAmount = sessionBalance * (100 - uint256(session.getProfitPercent()));
            lotteryAmount /= 100;
            assert(lotteryAmount < sessionBalance); // safety check

            transfer(winnerAddress, lotteryAmount);
        }
    }

    function onConnect() external view returns (connectResponse memory) {
        return connectResponse(
            {
                config: config,
                filledSlots: session.getFilledSlots(),
                totalSlots: session.getTotalSlots(),
                slotPrice: session.getSlotPrice(),
                prevWinnerSlot: winnerSlot,
                profitPercent: session.getProfitPercent(),
                open: session.isOpen(),
                prevWinnerAddress: winnerAddress
            }
        );
    }

    function buySlot(uint256 _slotNum) external payable lotteryOpen {
        require(msg.sender != owner, "Owner cannot participate");
        require(msg.value >= session.getSlotPrice(), "Invalid amount to buy a slot");
        require(session.isSlotAvailable(_slotNum), "Specified slot is not available");

        session.buySlot(_slotNum, msg.sender);

        emit Transaction(msg.sender, msg.value, "Transaction received for one lottery slot");
    }

    // transfer all remaining balance to owner and delete the contract from EVM
    function destroy() external onlyOwner lotteryClosed {
        selfdestruct(owner);
    }

}
