const router = require("express").Router();
const {
    createNotice,
    getNotices,
    deleteNotice,
    updateNotice,
} = require("../controllers/noticeController");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

router
    .route("/")
    .post([isLoggedIn, isAdmin], createNotice)
    .get([isLoggedIn, isAdmin], getNotices);

router
    .route("/:id")
    .delete([isLoggedIn, isAdmin], deleteNotice)
    .patch([isLoggedIn, isAdmin], updateNotice);

module.exports = router;
