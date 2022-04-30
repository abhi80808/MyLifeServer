const express = require('express');
const FundStorage = require('../models/FundStorage');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.post("/fund/storage/create", verifyToken, async (req, res, next) => {
    const fundStorage = new FundStorage(req.body);
    fundStorage.save().then((data) => {
        const finance = req.finance;
        finance.funds.push(data._id);
        finance.save().catch((err) => {
            console.log(err);
        });
        return res.status(200).json(data);
    }).catch((err) => {
        return res.status(422).json(err);
    });
});

module.exports = router;