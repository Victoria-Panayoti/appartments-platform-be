const express = require("express");

const controllers = require("../controllers/appartment");
const validateBody = require("../middlewares/validateBody");
const schemas = require("../schemas/appartment");

const router = express.Router();


router.get("/", controllers.getAllAppartments);

router.get("/:id",controllers.getAppartmentById );

router.post("/", validateBody(schemas.appartmentSchema),controllers.addNewAppartment);

router.put("/:id",validateBody(schemas.appartmentSchema), controllers.updateAppartmentById);

router.delete("/:id",controllers.deleteAppartmentById );

module.exports = router;
