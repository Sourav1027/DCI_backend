const bcrypt = require('bcryptjs');
const User = require('../model/user/user.js');

exports.create = async (req,res) =>{
   try {
    const {name, roleName, email, password, address, phone} = req.body;

    //Hash password
    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create({
        name,
        roleName,
        email,
        password: hashedPassword,
        address,
        phone,
    });
    res.status (201).send({message:"User Created Successfully",data: user});

   } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error creating user", error: error.message });
   }

};

// Get All Users
exports.getAll = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).send({ data: users });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching users", error: error.message });
    }
};

// Get User by ID
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({ data: user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching user", error: error.message });
    }
};

// Update User
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, roleName, email, address, phone } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        await user.update({ name, roleName, email, address, phone });

        res.status(200).send({ message: "User updated successfully", data: user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error updating user", error: error.message });
    }
};

// Delete User
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        await user.destroy();

        res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error deleting user", error: error.message });
    }
};

