const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/users/user");
const { HttpError, controllerWrapper, cloudinary } = require("../helpers");
const { Appartment } = require("../models/appartments/appartment");

const { SECRET_KEY } = process.env;

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const cloudinaryObj = await cloudinary.uploader.upload(req.file.path);
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    avatar: cloudinaryObj.secure_url,
    cloudinary_id: cloudinaryObj.public_id,
  });
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    avatar: newUser.avatar,
    cloudinary_id: newUser.public_id,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is invalid");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({ token });
};

const updateUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  await cloudinary.uploader.destroy(user.cloudinary_id);
  const cloudinaryObj = await cloudinary.uploader.upload(req.file.path);

  const result = await User.findByIdAndUpdate(
    id,
    {
      ...req.body,
      avatar: cloudinaryObj.path || user.avatar,
      cloudinary_id: cloudinaryObj.public_id || user.cloudinary_id,
    },
    { new: true }
  );
  if (!result) {
    next(HttpError(403));
  }
  res.json(result);
};

const getCurrent = async (req, res) => {
  const { name, email } = req.user;
  res.json({ name, email });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    message: "Logout success",
  });
};
module.exports = {
  registerUser: controllerWrapper(registerUser),
  loginUser: controllerWrapper(loginUser),
  updateUserById: controllerWrapper(updateUserById),
  getCurrent: controllerWrapper(getCurrent),
  logout: controllerWrapper(logout),
};
