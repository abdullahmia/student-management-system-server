const router = require("express").Router();

const {
    createDepartment,
    getDepartments,
    deleteDepartment,
    updateDepartment,
} = require("../controllers/academicController");
const uploader = require("../lib/multer");

// middleware
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

router
    .route("/department")
    .post([isLoggedIn, isAdmin, uploader.single("image")], createDepartment)
    .get([isLoggedIn, isAdmin], getDepartments);

router
    .route("/department/:id")
    .delete([isLoggedIn, isAdmin], deleteDepartment)
    .patch([isLoggedIn, isAdmin, uploader.single("image")], updateDepartment);

module.exports = router;
