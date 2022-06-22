const sendMail = require("../lib/nodemailer");
const { passwordGenarate } = require("../utils/passwordGenarate");
const { User, validateUser } = require("../models/user");
const _ = require("lodash");
const { createResponse } = require("../utils/responseGenarate");
const issueJWT = require("../lib/jwt");

// create user by admin
module.exports.createUser = async (req, res) => {
    const error = validateUser(req.body);
    if (error.error)
        return res
            .status(400)
            .json(
                createResponse(null, error.error.details[0].message, true, null)
            );

    const { firstName, lastName, email, role } = req.body;
    if (firstName && lastName && email) {
        // checking if user is already is exist
        let isUser = await User.findOne({ email });
        if (isUser) {
            return res
                .status(409)
                .json(createResponse(null, "Already have an user"));
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
    }
};
