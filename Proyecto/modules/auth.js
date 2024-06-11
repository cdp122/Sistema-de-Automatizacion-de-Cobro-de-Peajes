const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
    return jwt.sign(user, "telepass", { expiresIn: "20m" });
}

function validateToken(req, res, next) {
    try {
        const token = req.headers['authorization'];
        if (!token) res.redirect('error/404');

        jwt.verify(token, "telepass", (err, user) => {
            if (err) {
                console.log("Autenticación por usuario fallida.");
                res.json({ message: "AUTENTICACIÓN FALLIDA" });
            } else {
                console.log("Autenticación exitosa.");
                req.user = user;
                next();
            }
        })
    }
    catch { res.redirect('error/404'); }
}

module.exports = { generar: generateAccessToken, validar: validateToken }