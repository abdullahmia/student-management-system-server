const sendMail = require("../lib/nodemailer");
const { passwordGenarate } = require("../utils/passwordGenarate");
const { User, Student, Teacher, Token } = require("../models/user");
const _ = require("lodash");
const { createResponse } = require("../utils/responseGenarate");
const issueJWT = require("../lib/jwt");
const crypto = require("crypto");

// create user by admin
module.exports.createUser = async (req, res) => {
    const { firstName, lastName, email, role, semester, department, session } =
        req.body;
    if (firstName && lastName && email) {
        // checking if user is already is exist

        let isUser = await User.findOne({ email });
        if (isUser) {
            return res
                .status(409)
                .json(createResponse(null, "Already have an user", true));
        } else {
            let password = passwordGenarate();
            const user = new User({
                firstName,
                lastName,
                email,
                password,
                role,
            });
            await user.save();

            // sending mail with the user credentials
            sendMail(
                email,
                "your account credentials",
                `Your Email: ${email}, Your Password: ${password}`
            );

            if (role === "student") {
                // create a student
                const student = new Student({
                    user: user._id,
                    semester,
                    department,
                    session,
                });
                await student.save();
            } else if (role === "teacher") {
                // create a teacher
                const teacher = new Teacher({ user: user._id });
                await teacher.save();
            }
            return res
                .status(201)
                .json(
                    createResponse(
                        _.pick(user, [
                            "_id",
                            "fistName",
                            "lastName",
                            "email",
                            "image",
                        ]),
                        "User has been created"
                    )
                );
        }
    }
};

// user login
module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json(createResponse(null, "Account not found"));
        }

        // validate the password
        const isValidatePassword = await user.isValidPassword(password);
        if (!isValidatePassword) {
            return res
                .status(401)
                .json(createResponse(null, "Invalid Credientials"));
        }

        // creating token with jwt
        const token = issueJWT(user);
        return res.status(200).json(
            createResponse(
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    image: user.image,
                },
                "Login successfull",
                false,
                token
            )
        );
    } else {
        return res
            .status(400)
            .json(createResponse(null, "Field Requred", true));
    }
};

// get user by role
module.exports.getUsers = async (req, res) => {
    const role = req.params.role;
    const users = await User.find({ role }).select("-password");
    return res.status(200).json(createResponse(users, "users"));
};

// delete a user by role and id
module.exports.deleteUserByRoleId = async (req, res) => {
    try {
        const { role, id } = req.params;
        const user = await User.findOne({ _id: id, role });
        if (user) {
            if (role === "teacher") {
                await User.findOneAndDelete({ _id: id, role });
                await Teacher.findOneAndDelete({ user: id });
                return res
                    .status(200)
                    .json(createResponse(null, "Teacher has been deleted"));
            } else if (role === "student") {
                await User.findOneAndDelete({ _id: id, role });
                await Student.findOneAndDelete({ user: id });
                return res
                    .status(200)
                    .json(createResponse(null, "Student has been deleted"));
            }
        } else {
            return res
                .status(404)
                .json(createResponse(null, "User not found", true));
        }
    } catch (error) {
        return res
            .status(404)
            .json(createResponse(null, "User not found", true));
    }
};

// change password
module.exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confrimPassword } = req.body;
        if (oldPassword && newPassword && confrimPassword) {
            if (newPassword === confrimPassword) {
                let user = req.user;
                user = await User.findOne({ _id: user._id, email: user.email });
                let isValidUser = await user.isValidPassword(oldPassword);
                if (!isValidUser) {
                    return res
                        .status(401)
                        .json(
                            createResponse(null, "Old password is not correct")
                        );
                } else {
                    user.password = confrimPassword;
                    await user.save();
                    return res
                        .status(200)
                        .json(
                            createResponse(null, "Password has been changed")
                        );
                }
            } else {
                return res
                    .status(404)
                    .json(
                        createResponse(
                            null,
                            "Password and confirm password not matched",
                            true
                        )
                    );
            }
        } else {
            return res
                .status(400)
                .json(createResponse(null, "Field Requred", true));
        }
    } catch (error) {
        return res
            .status(404)
            .json(createResponse(null, "User not found", true));
    }
};

// forgot password email send
module.exports.forgotPasswordEmailSend = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res
                .status(404)
                .json(createResponse(null, "Email has been requried", true));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json(
                    createResponse(null, "User not found with this email", true)
                );
        }

        let token = await Token.findOne({ user: user._id });
        if (!token) {
            token = new Token({
                user: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            });
            await token.save();
        }
        const url = `${process.env.CLIENT_URL}/password-reset/${user._id}/${token.token}`;
        // send the url via mail
        sendMail(user.email, "Password reset", url);
        return res
            .status(200)
            .json(
                createResponse(
                    null,
                    "Password reset link sent to your email account"
                )
            );
    } catch (error) {
        res.status(500).json(
            createResponse(null, "Internal server error", true)
        );
    }
};

// reset your password
module.exports.resetPassword = async (req, res) => {
    try {
        const { user, token } = req.params;
        const { newPassword, confirmPassword } = req.body;
        // find the user
        let getUser = await User.findOne({ _id: user });
        let userToken = await Token.findOne({ token: token });
        if (getUser && userToken) {
            if (newPassword === confirmPassword) {
                getUser.password = confirmPassword;
                await getUser.save();
                return res
                    .status(200)
                    .json(createResponse(null, "Password has been reset"));
            } else {
                return res
                    .status(404)
                    .json(
                        createResponse(
                            null,
                            "Password and confirm password not matched",
                            true
                        )
                    );
            }
        } else {
            return res
                .status(404)
                .json(createResponse(null, "Invalid Link", true));
        }
    } catch (error) {
        res.status(500).json(
            createResponse(null, "Internal server error", true)
        );
    }
};
