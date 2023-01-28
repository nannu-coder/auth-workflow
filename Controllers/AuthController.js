const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");
const { BadRequestError, unAuthenticateError } = require("../Errors");
const { cookiesReponse } = require("../Utils/JWT");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Plsease Provide All Valuse");
  }

  const emailAlreadyExit = await User.findOne({ email });
  if (emailAlreadyExit) {
    throw new BadRequestError("Email Already Exit");
  }

  const isFirst = (await User.countDocuments({})) === 0;

  const role = isFirst ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  const tokenUser = {
    name,
    id: user._id,
    role,
  };

  cookiesReponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please enter email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new unAuthenticateError("Invalid Credentials");
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new unAuthenticateError("Invalid Credentials");
  }

  const tokenUser = {
    name: user.name,
    id: user._id,
    role: user.role,
  };

  cookiesReponse({ res, user: tokenUser });

  res
    .status(StatusCodes.OK)
    .json({ id: user._id, name: user.name, email: user.email });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "User Logged Out" });
};

module.exports = { register, login, logout };
