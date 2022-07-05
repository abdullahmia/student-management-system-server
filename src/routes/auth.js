const {
    createUser,
    login,
    getUsers,
    deleteUserByRoleId,
    changePassword,
} = require("../controllers/authController");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

const router = require("express").Router();

router.post("/create-user", isLoggedIn, isAdmin, createUser);
router.route("/login").post(login);
router.route("/users/:role").get([isLoggedIn, isAdmin], getUsers);
router
    .route("/user/:role/:id")
    .delete([isLoggedIn, isAdmin], deleteUserByRoleId);

router.route("/password-change").patch(isLoggedIn, changePassword);

module.exports = router;
