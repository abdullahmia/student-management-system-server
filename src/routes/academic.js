const router = require("express").Router();

const {
    createDepartment,
    getDepartments,
    deleteDepartment,
    updateDepartment,
    createSubject,
    getSubjects,
    deleteSubject,
    updateSubject,
} = require("../controllers/academicController");
const uploader = require("../lib/multer");

// middleware
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

// Department routes
router
    .route("/department")
    .post([isLoggedIn, isAdmin, uploader.single("image")], createDepartment)
    .get([isLoggedIn, isAdmin], getDepartments);

router
    .route("/department/:id")
    .delete([isLoggedIn, isAdmin], deleteDepartment)
    .patch([isLoggedIn, isAdmin, uploader.single("image")], updateDepartment);

// Subject routes
router
    .route("/subject")
    .post([isLoggedIn, isAdmin, uploader.single("image")], createSubject)
    .get([isLoggedIn, isAdmin], getSubjects);

router
    .route("/subject/:id")
    .delete([isLoggedIn, isAdmin], deleteSubject)
    .patch([isLoggedIn, isAdmin, uploader.single("image")], updateSubject);

module.exports = router;
