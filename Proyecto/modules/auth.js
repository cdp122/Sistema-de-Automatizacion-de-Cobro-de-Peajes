const app = require("../index");
const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
    return jwt.sign(user, "telepass", { expiresIn: "10m" });
}

function validateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) res.redirect('error/404');

    jwt.verify(token, "telepass", (err, user) => {
        if (err) res.redirect('error/404');
        else {
            req.user = user;
            next();
        }
    })
}

module.exports = { generar: generateAccessToken, validar: validateToken }