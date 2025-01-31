const User = require("../model/user/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        email: user.email,
        roleName: user.roleName, // Add any other details you want
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response with user details and token
    return res.status(200).json({
      message: "Login successful",
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleName: user.roleName, // Add any other fields you need
        address: user.address,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        message: "An error occurred while logging in",
        error: error.message,
      });
  }
};
