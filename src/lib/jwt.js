const jsonwebtoken = require("jsonwebtoken");

function issueJWT(user) {
    const _id = user._id;

    // making jwt payload
    const payload = {
        _id: _id,
        email: user.email,
        role: user.role,
        sub: _id,
        iat: new Date().getTime() / 1000,
    };

    const signedToken = jsonwebtoken.sign(payload, process.env.JWT_SECRET);
    return `Bearer ${signedToken}`;
}

module.exports = issueJWT;
