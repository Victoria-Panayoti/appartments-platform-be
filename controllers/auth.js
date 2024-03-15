const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/users/user");
const { HttpError, controllerWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const registerUser = async (req, res) => {
    const { email,password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409,"Email already in use")
    }
    const hashedPassword= await bcrypt.hash(password,10)
    const newUser = await User.create({...req.body, password:hashedPassword});
    res.status(201).json({
        name: newUser.name,
        email:newUser.email,
    })
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401,"Email or password is invalid")
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401,"Email or password is invalid")
    }
    const payload = {
        id:user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id,{token})
    res.json({token});
}

const getCurrent = async (req, res) => {
    const { name, email } = req.user;
    res.json({name, email});
}

const logout=async(req,res)=> {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.json({
        message:"Logout success"
    })
}
module.exports = {
    registerUser: controllerWrapper(registerUser),
    loginUser: controllerWrapper(loginUser),
    getCurrent: controllerWrapper(getCurrent),
    logout: controllerWrapper(logout),
}