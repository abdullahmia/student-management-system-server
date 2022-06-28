const { Schema, model, Types } = require("mongoose");

// notice schema
const noticeSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Notice = model("Notice", noticeSchema);
module.exports = { Notice };
