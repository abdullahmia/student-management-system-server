const { Schema, model, Types } = require("mongoose");

// Department Schema
const departmentSchema = new Schema(
    {
        semester: {
            type: Number,
            requried: true,
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: "department-of-education-728303-removebg-preview_dqhwhr",
        },
    },
    { timestamps: true }
);

// Subject Schema
const subjectSchema = new Schema({
    semester: {
        type: Number,
        requried: true,
    },
    department: {
        type: Types.ObjectId,
        ref: "Department",
        requried: true,
    },
    name: {
        type: String,
        rquired: true,
    },
    image: {
        type: String,
        default: "download-removebg-preview_gbalkk",
    },
});

const Department = model("Department", departmentSchema);
const Subject = model("Subject", subjectSchema);
module.exports = { Department, Subject };
