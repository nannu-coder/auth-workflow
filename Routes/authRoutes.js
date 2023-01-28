const router = require("express").Router();
const { login, register, logout } = require("../Controllers/AuthController");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
