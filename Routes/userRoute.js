const router = require("express").Router();
const { showMe } = require("../Controllers/userController");

router.route("/showme").get(showMe);

module.exports = router;
