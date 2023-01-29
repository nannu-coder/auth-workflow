const router = require("express").Router();
const { showMe } = require("../Controllers/userController");
const authenTicate = require("../Middleware/authenticate");

router.route("/showme").get(authenTicate, showMe);

module.exports = router;
