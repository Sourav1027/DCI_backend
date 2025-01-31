const { Center } = require('../model/center/center');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginCenter = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Find center by emailId
    const center = await Center.findOne({ where: { emailId } });

    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }

    // Check if center is suspended
    if (center.status === 0) {
      return res.status(403).json({ message: 'This center has been suspended' });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, center.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { centerId: center.centerId, emailId: center.emailId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while logging in' });
  }
};
