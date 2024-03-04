const express = require("express");

const appartmentsRouters=require('./appartments')

const router = express.Router();

router.use("/appartments", appartmentsRouters)

module.exports = router;
