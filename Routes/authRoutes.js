const router = require("express").Router();
const {
  login,
  register,
  logout,
  verifyToken,
  forgotPassword,
  resetPassword,
} = require("../Controllers/AuthController");
const authenTicate = require("../Middleware/authenticate");

router.post("/register", register);
router.post("/login", login);
router.delete("/logout", authenTicate, logout);
router.post("/verifytoken", verifyToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
