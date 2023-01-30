const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const { BadRequestError, unAuthenticateError } = require("../Errors");
const { cookiesReponse } = require("../Utils/JWT");
const crypto = require("crypto");
const sendVerificationMail = require("../Utils/sendVerficationEmail");
const sendResetPasswordEmail = require("../Utils/sendResetPasswordEmail");

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

  const origin = "http://localhost:3000";

  await sendVerificationMail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res.status(StatusCodes.CREATED).json({
    status: "Success! Please Check Email to verify Account",
  });
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

  if (!user.isVerified) {
    throw new unAuthenticateError("Please verify your Account");
  }

  const tokenUser = {
    name: user.name,
    id: user._id,
    role: user.role,
  };

  //create refresh token
  let refreshToken = "";

  //check existing token

  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new unAuthenticateError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
    cookiesReponse({ res, user: tokenUser, refreshToken });
    res
      .status(StatusCodes.OK)
      .json({ id: user._id, name: user.name, email: user.email });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  cookiesReponse({ res, user: tokenUser, refreshToken });

  await Token.create(userToken);

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
  await Token.findOneAndDelete({ user: req.user.id });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "User Logged Out" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide a valid email");
  }

  const user = await User.findOne({ email });

  if (user) {
    const passwordToken = crypto.randomBytes(72).toString("hex");
    //senEmail
    const origin = "http://localhost:3000";

    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      roken: passwordToken,
      origin,
    });

    const tenMinitues = 1000 * 60 * 10;
    const passwordExpire = new Date(Date.now() + tenMinitues);

    user.passwordToken = passwordToken;
    user.passwordTokenExpire = passwordExpire;

    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please Check your Email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === token &&
      user.passwordTokenExpire > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpire = null;
      await user.save();
    }
  }

  res.send("reset password");
};

module.exports = {
  register,
  login,
  logout,
  verifyToken,
  forgotPassword,
  resetPassword,
};
