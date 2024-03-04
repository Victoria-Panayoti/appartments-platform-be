const express = require("express");
const Joi = require("joi");

const { HttpError } = require("../helpers");

const appartments = require("../models/appartments");

const router = express.Router();

const appartmentSchema = Joi.object({
  picture: Joi.string().required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  description: Joi.string().required(),
  rating: Joi.number().required(),
  price: Joi.number().required(),
});

router.get("/", async (__, res, next) => {
  try {
    const result = await appartments.getAllAppartments();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await appartments.getAppartmentById(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = appartmentSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await appartments.addNewAppartment(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { error } = appartmentSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await appartments.updateAppartmentById(id, req.body);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async(req, res,next) => {
  try {
    const { id } = req.params;
    const result = await appartments.deleteAppartmentByID(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({message:"Delete success"})
  } catch (error) {
    next(error);
 }
});

module.exports = router;
