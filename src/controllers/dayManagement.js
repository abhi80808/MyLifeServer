const express = require('express');

const router = express.Router();

router.get("/dayManagement", verifyToken, async (req, res, next) => {
    return res.status(200).json(req.dayManagement);
})

module.exports = router;