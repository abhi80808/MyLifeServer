const express = require('express');
const FundStorage = require('../models/FundStorage');
const verifyToken = require('../middleware/auth');
const SelfTransferTransaction = require('../models/SelfTransferTransaction');

const router = express.Router();

router.get("/net-worth", verifyToken, async (req, res, next) => {
    const funds = req.finance.funds;
    let net_worth = 0
    funds.forEach(fund => net_worth += fund.balance);
    return res.status(200).json({net_worth, funds});
});

router.post("/fund/storage/create", verifyToken, async (req, res, next) => {
    const fundStorage = new FundStorage(req.body);
    await fundStorage.save().then(async (fundStorageData) => {
        const finance = req.finance;
        finance.funds.push(fundStorageData._id);
        await finance.save().catch((err) => {
            console.log(err);
        });
        return res.status(200).json(data);
    }).catch((err) => {
        return res.status(422).json(err);
    });
});

router.put("/fund/selftransfer", verifyToken, async (req, res, next) => {
    const {transferFromId, transferToId, amount} = req.body;
    if(transferFromId === transferToId) return res.status(422).json({message: "Choose different account to transfer to"});
    const selfTransferLog = req.finance.selfTransferLog;
    const funds = req.finance.funds;
    let transferFrom={}, transferTo={};
    for(let f of funds) {
        if(f.id === transferFromId) transferFrom = f;
        else if(f.id === transferToId) transferTo = f;
    }
    transferFrom.balance -= amount;
    transferTo.balance += amount;
    await transferFrom.save().then(async (transferFromData) => {
        await transferTo.save().then(async (transferToData) => {
            const selfTransferTransaction = new SelfTransferTransaction({transferFrom: transferFromData._id, transferTo: transferToData._id, amount});
            await selfTransferTransaction.save().then(async (selfTransferTransactionData) => {
                selfTransferLog.log.push(selfTransferTransactionData._id);
                await selfTransferLog.save().then(() => {
                    return res.status(200).json({message: "Transfer successful"});
                });
            });
        });
    });
})

module.exports = router;