const {
    createUser,
    login,
    getUsers,
    deleteUserByRoleId,
    changePassword,
    forgotPasswordEmailSend,
    resetPassword,
    uploadProfile,
} = require("../controllers/authController");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

const uploader = require("../lib/multer");

const router = require("express").Router();

router.post("/create-user", isLoggedIn, isAdmin, createUser);
router.route("/login").post(login);
router.route("/users/:role").get([isLoggedIn, isAdmin], getUsers);
router
    .route("/user/:role/:id")
    .delete([isLoggedIn, isAdmin], deleteUserByRoleId);

router
    .route("/upload-profile")
    .patch([isLoggedIn, uploader.single("image")], uploadProfile);
router.route("/password-change").patch(isLoggedIn, changePassword);
router.route("/forgot-password").post(forgotPasswordEmailSend);
router.route("/reset-password/:user/:token").patch(resetPassword);

module.exports = router;
