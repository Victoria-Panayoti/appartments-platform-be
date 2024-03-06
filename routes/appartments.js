const express = require("express");

const controllers = require("../controllers/appartment");
const { isValidId, validateBody } = require("../middlewares");
const schemas = require("../schemas/appartment");

const router = express.Router();


router.get("/", controllers.getAllAppartments);

router.get("/:id",isValidId,controllers.getAppartmentById );

router.post("/", validateBody(schemas.joiAppartmentSchema),controllers.addNewAppartment);

router.put("/:id", isValidId,validateBody(schemas.joiAppartmentSchema), controllers.updateAppartmentById);

router.delete("/:id",isValidId,controllers.deleteAppartmentById );

module.exports = router;
