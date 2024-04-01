const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const { User } = require("../models/users/user");
const {
  HttpError,
  controllerWrapper,
  cloudinary,
  sendEmail,
} = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const cloudinaryObj = await cloudinary.uploader.upload(req.file.path);
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    avatar: cloudinaryObj.secure_url,
    cloudinary_id: cloudinaryObj.public_id,
    verificationCode,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${newUser.verificationCode}" >Click verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    avatar: newUser.avatar,
    cloudinary_id: newUser.public_id,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });
  res.json({ message: "Email verify success" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is invalid");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verified");
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
  verifyEmail: controllerWrapper(verifyEmail),
  loginUser: controllerWrapper(loginUser),
  updateUserById: controllerWrapper(updateUserById),
  getCurrent: controllerWrapper(getCurrent),
  logout: controllerWrapper(logout),
};
