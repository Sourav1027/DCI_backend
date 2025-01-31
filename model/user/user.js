const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roleName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // email: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     unique: true,
    //     // validate: {
    //     //     isEmail: true,
    //     // },
    // },
    email: {
        type: DataTypes.STRING,
        allowNull:false,
        // unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //     is: /^[0-9]{10,15}$/, // Validates phone number format
        // },
    },
});

module.exports = User;
