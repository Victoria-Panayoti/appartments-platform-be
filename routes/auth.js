const express = require("express");
const { validateBody } = require("../middlewares");
const { schemas } = require("../models/users/user");
const controllers=require("../controllers/auth")

const router = express.Router();

router.post("/register", validateBody(schemas.joiRegisterSchema), controllers.registerUser);
router.post("/login", validateBody(schemas.joiLoginSchema), controllers.loginUser);

module.exports = router;