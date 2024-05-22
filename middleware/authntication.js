const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        res.status(401)
        res.send("You must be login")
        return;
    }

    try {
        const data = jwt.verify(token, "thenameiskunal022");
        req.user = data;
        console.log(req.user);
        next();
    } catch (e) {
        res.status(500).send("Token invalid");
    }
}

module.exports = isLoggedIn;
