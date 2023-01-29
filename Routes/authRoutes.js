const router = require("express").Router();
const {
  login,
  register,
  logout,
  verifyToken,
} = require("../Controllers/AuthController");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/verifytoken", verifyToken);

module.exports = router;
