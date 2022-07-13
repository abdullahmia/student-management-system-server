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
    },
    role: {
        type: String,
        enum: ["admin", "teacher", "student"],
        default: "student",
    },
});

// token schela
const tokenSchema = Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: "User",
            requried: true,
            uniqe: true,
        },
        token: {
            type: String,
            uniqe: true,
            requierd: true,
        },
    },
    { timestamp: true }
);

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

// Teacher Schema
const teacherSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    phoneNumber: Number,
    country: String,
    city: String,
    presentAddress: String,
    parmanentAddress: String,
    dateOfBirth: String,
    religion: String,
    eq: {
        type: Array,
        default: [],
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
const Token = model("Token", tokenSchema);
const Student = model("Student", studentSchema);
const Teacher = model("Teacher", teacherSchema);
module.exports = { User, Student, Teacher, Token };
