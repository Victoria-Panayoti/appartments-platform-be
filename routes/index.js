const express = require("express");

const appartmentsRouters = require("./appartments");
const authRouters = require("./auth");

const router = express.Router();

router.use("/appartments", appartmentsRouters);
router.use("/auth", authRouters);

module.exports = router;
