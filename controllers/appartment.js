const { Appartment } = require("../models/appartments/appartment");
const { HttpError, controllerWrapper, cloudinary } = require("../helpers");

const getAllAppartments = async (req, res) => {
  const { page = 1, limit = 9 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Appartment.find({}, "-createdAt -updatedAt", {
    skip,
    limit,
  });
  res.json(result);
};
const getAppartmentById = async (req, res) => {
  const { id } = req.params;
  const result = await Appartment.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addNewAppartment = async (req, res) => {
  const { _id: owner } = req.user;
  const cloudinaryObj = await cloudinary.uploader.upload(
    req.file.path,
    function (error, result) {
      if (error) {
        res.status(500).json({ message: "Error" });
      }
      return result;
    }
  );

  const result = await Appartment.create({
    ...req.body,
    picture: cloudinaryObj.secure_url,
    cloudinary_id: cloudinaryObj.public_id,
    owner,
  });
  res.status(201).json(result);
};
const updateAppartmentById = async (req, res, next) => {
  const { id } = req.params;
  const appartment = await Appartment.findById(id);
  await cloudinary.uploader.destroy(appartment.cloudinary_id);
  const cloudinaryObj = await cloudinary.uploader.upload(req.file.path);

  const result = await Appartment.findOneAndUpdate(
    { _id: id, owner: req.user.id },
    {
      ...req.body,
      picture: cloudinaryObj.path || appartment.picture,
      cloudinary_id: cloudinaryObj.public_id || appartment.cloudinary_id,
    },
    {
      new: true,
    }
  );
  if (!result) {
    next(HttpError(403));
  }

  res.json(result);
};
const deleteAppartmentById = async (req, res, next) => {
  const { id } = req.params;

  const result = await Appartment.findOneAndDelete({
    _id: id,
    owner: req.user.id,
  });
  if (!result) {
    next(HttpError(403));
  }
  await cloudinary.uploader.destroy(result.cloudinary_id);
  res.json({ message: "Delete success" });
};
const updateFavorite = async (req, res) => {
  const { id } = req.params;

  const result = await Appartment.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

module.exports = {
  getAllAppartments: controllerWrapper(getAllAppartments),
  getAppartmentById: controllerWrapper(getAppartmentById),
  addNewAppartment: controllerWrapper(addNewAppartment),
  updateAppartmentById: controllerWrapper(updateAppartmentById),
  deleteAppartmentById: controllerWrapper(deleteAppartmentById),
  updateFavorite: controllerWrapper(updateFavorite),
};
