const { Schema, model, Types } = require("mongoose");
const bcrypt = require("bcryptjs");

// user Schema
const userSchema = new Schema({
    firstName: {
        type: String,
        minlength: 3,
        maxlength: 20,
        required: true,
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 20,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        uniqe: true,
        required: true,
    },
    password: {
        type: String,
    },
    image: {
        type: String,
        default: "dummy-avatar_gh7fhs",
    },
    role: {
        type: String,
        enum: ["admin", "teacher", "student"],
        default: "student",
    },
});

// Student Schema
const studentSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "User",
        requried: true,
    },
    semester: {
        type: Number,
        requried: true,
    },
    department: {
        type: String,
        required: true,
    },
    session: {
        type: String,
        required: true,
    },
    phone: {
        Type: Number,
    },
    country: String,
    city: String,
    presentAddress: String,
    parmanentAddress: String,
    religion: String,
    gurdianName: String,
    gurdianPhone: Number,
    dateOfBirth: {
        type: Date,
        trim: true,
    },
});

userSchema.pre("save", async function (next) {
    const user = this;
    const hash = await bcrypt.hash(user.password, 10);
    this.password = hash;
    next();
});

userSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
};

const User = model("User", userSchema);
const Student = model("Student", studentSchema);
module.exports = { User, Student };
