const { Notice } = require("../models/notice");
const { createResponse } = require("../utils/responseGenarate");

// create a notice
module.exports.createNotice = async (req, res) => {
    const { title, content } = req.body;
    const user = req.user;
    const notice = new Notice({ user: user._id, title, content });
    await notice.save();
    return res.status(201).json(createResponse(null, "Notice has been added"));
};

// get all notieces
module.exports.getNotices = async (req, res) => {
    const notices = await Notice.find({});
    return res.status(200).json(createResponse(notices, "Notices"));
};

// delete notice with id
module.exports.deleteNotice = async (req, res) => {
    try {
        const id = req.params.id;
        await Notice.findOneAndDelete({ _id: id });
        return res
            .status(200)
            .json(createResponse(null, "Notice has been deleted"));
    } catch (error) {
        return res.status(404).json(createResponse(null, "Notice not found"));
    }
};

// update a notice
module.exports.updateNotice = async (req, res) => {
    const id = req.params.id;
    try {
        const { title, content } = req.body;
        const user = req.user;
        await Notice.findOneAndUpdate(
            { _id: id },
            { user: user._id, title, content },
            { new: true }
        );
        return res
            .status(200)
            .json(createResponse(null, "Notice has been updated"));
    } catch (error) {
        return res.status(404).json(createResponse(null, "Notice not found"));
    }
};
