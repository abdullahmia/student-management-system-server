const { Schema, model } = require("mongoose");
const Joi = require("joi");
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

// field validate with joi
const validateUser = (user) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(20).required(),
        lastName: Joi.string().min(3).max(20).required(),
        email: Joi.string().required(),
        role: Joi.string().required(),
    });
    return schema.validate(user);
};

const User = model("User", userSchema);
module.exports.User = User;
module.exports.validateUser = validateUser;
