const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user/user.js');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required." });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid credentials." });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || "your_secret_key", // Use a secret key from .env
            { expiresIn: "1h" } // Token expiration time
        );

        res.status(200).send({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error("Error in login:", error.message);
        res.status(500).send({ message: "Internal server error" });
    }
};
