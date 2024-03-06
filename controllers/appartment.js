const Appartment = require("../models/appartments/appartment")
const { HttpError,controllerWrapper } = require("../helpers");


const getAllAppartments = async (__, res) => {
        const result = await Appartment.find({},"-createdAt -updatedAt");
        res.json(result);
}
const getAppartmentById=async (req, res) => {
    const { id } = req.params;
    const result = await Appartment.findById(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  
}
const addNewAppartment=async (req, res) => {
    const result = await Appartment.create(req.body);
    res.status(201).json(result);
}
const updateAppartmentById=async (req, res) => {
    const { id } = req.params;
    const result = await Appartment.findByIdAndUpdate(id, req.body,{new:true});
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
}
const deleteAppartmentById=async(req, res) => {
    const { id } = req.params;
    const result = await Appartment.findByIdAndDelete(id);
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