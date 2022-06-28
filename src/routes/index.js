const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/academic", require("./academic"));
router.use("/notice", require("./notice"));

module.exports = router;
