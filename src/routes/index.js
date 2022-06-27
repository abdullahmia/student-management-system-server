const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/academic", require("./academic"));

module.exports = router;
