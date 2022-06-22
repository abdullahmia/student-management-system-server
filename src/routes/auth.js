const { createUser, login } = require("../controllers/authController");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

const router = require("express").Router();

router.post("/create-user", isLoggedIn, isAdmin, createUser);
router.route("/login").post(login);

module.exports = router;
