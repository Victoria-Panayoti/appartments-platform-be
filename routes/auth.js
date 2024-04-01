const express = require("express");
const { validateBody, authenticate, upload } = require("../middlewares");
const { schemas } = require("../models/users/user");
const controllers=require("../controllers/auth")

const router = express.Router();

router.post("/register", upload.single("avatar"), validateBody(schemas.joiRegisterSchema), controllers.registerUser);
router.get("/verify/:verificationCode",controllers.verifyEmail)
router.post("/login", validateBody(schemas.joiLoginSchema), controllers.loginUser);
router.put("/:id",upload.single("avatar"),controllers.updateUserById)
router.get("/current", authenticate, controllers.getCurrent);
router.post("/logout", authenticate, controllers.logout)

module.exports = router;