const express = require("express");

const controllers = require("../controllers/appartment");
const { isValidId, validateBody, authenticate, upload } = require("../middlewares");
const { schemas } = require("../models/appartments/appartment");

const router = express.Router();

router.get("/",controllers.getAllAppartments);

router.get("/:id", isValidId, controllers.getAppartmentById);

router.post(
  "/",
  authenticate,
  upload.single("picture"),
  validateBody(schemas.joiAppartmentSchema),
  controllers.addNewAppartment
);

router.put(
  "/:id",
  authenticate,
  isValidId,
  upload.single("picture"),
  validateBody(schemas.joiAppartmentSchema),
  controllers.updateAppartmentById
);

router.delete(
  "/:id",
  authenticate,
  isValidId,
  controllers.deleteAppartmentById
);

router.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  controllers.updateFavorite
);

module.exports = router;
