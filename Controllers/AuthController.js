const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");
const { BadRequestError, unAuthenticateError } = require("../Errors");
const { cookiesReponse } = require("../Utils/JWT");
const crypto = require("crypto");

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

  const verificationToken = crypto.randomBytes(45).toString("hex");

  const user = await await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  // const tokenUser = {
  //   name,
  //   id: user._id,
  //   role,
  // };

  // cookiesReponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({
    status: "Success! Please Check Email to verify Account",
    Verifytoken: user.verificationToken,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please enter email and password");
  }

  console.log(email);

  const user = await User.findOne({ email });

  if (!user) {
    throw new unAuthenticateError("Invalid Credentials");
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new unAuthenticateError("Invalid Credentials");
  }

  if (!user.isVerified) {
    throw new unAuthenticateError("Please verify your Account");
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

const verifyToken = async (req, res) => {
  const { verifytoken, email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new unAuthenticateError("Verification Failed");
  }

  if (verifytoken !== user.verificationToken) {
    throw new unAuthenticateError("Verification Failed");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "User Logged Out" });
};

module.exports = { register, login, logout, verifyToken };
