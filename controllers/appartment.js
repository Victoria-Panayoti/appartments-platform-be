const appartments = require("../models/appartments");
const { HttpError,controllerWrapper } = require("../helpers");


const getAllAppartments = async (__, res) => {
        const result = await appartments.getAllAppartments();
        res.json(result);
}
const getAppartmentById=async (req, res) => {
    const { id } = req.params;
    const result = await appartments.getAppartmentById(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  
}
const addNewAppartment=async (req, res) => {
    const result = await appartments.addNewAppartment(req.body);
    res.status(201).json(result);
}
const updateAppartmentById=async (req, res) => {
    const { id } = req.params;
    const result = await appartments.updateAppartmentById(id, req.body);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
}
const deleteAppartmentById=async(req, res) => {
    const { id } = req.params;
    const result = await appartments.deleteAppartmentByID(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({message:"Delete success"})
}

module.exports = {
    getAllAppartments: controllerWrapper(getAllAppartments),
    getAppartmentById: controllerWrapper(getAppartmentById),
    addNewAppartment: controllerWrapper(addNewAppartment),
    updateAppartmentById: controllerWrapper(updateAppartmentById),
    deleteAppartmentById: controllerWrapper(deleteAppartmentById),
}