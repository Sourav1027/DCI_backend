const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Get token from header
        if (!token) {
            return res.status(401).send({ message: "Access denied. No token provided." });
        }

        // Verify token
        const dcodetech_database = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
        req.user = dcodetech_database; // Attach user data to request object
        next();
    } catch (error) {
        res.status(401).send({ message: "Invalid or expired token." });
    }
};
