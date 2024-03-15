const express = require("express");
const { validateBody, authenticate } = require("../middlewares");
const { schemas } = require("../models/users/user");
const controllers=require("../controllers/auth")

const router = express.Router();

router.post("/register", validateBody(schemas.joiRegisterSchema), controllers.registerUser);
router.post("/login", validateBody(schemas.joiLoginSchema), controllers.loginUser);
router.get("/current", authenticate, controllers.getCurrent);
router.post("/logout", authenticate, controllers.logout)

module.exports = router;