import { cryptoLottery } from "./contract";

export const withdrawFromContract = (amount, fromAddress) => {
    cryptoLottery.methods.withdraw(amount).send({
        from: fromAddress
    }).then((resp) => {
        console.log(resp);
    })
}

export const startLottery = (lotteryParams, fromAddress) => {
    cryptoLottery.methods.startLottery(lotteryParams).send({
        from: fromAddress
    }).then((resp) => {
        console.log(resp);
    });
}

export const stopLottery = (fromAddress) => {
    cryptoLottery.methods.stopLottery().send({
        from: fromAddress
    }).then((resp) => {
        console.log(resp);
    });
}

export const buySlot = (slotNum, amount, fromAddress) => {
    cryptoLottery.methods.buySlot(slotNum).send({
        from: fromAddress,
        value: amount
    }).then((resp) => {
        console.log(resp);
    })
}
