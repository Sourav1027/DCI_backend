const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Center = sequelize.define('Center', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
},
centerId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
},
centerName: {
    type: DataTypes.STRING,
    allowNull: false,
},
ownerName: {
    type: DataTypes.STRING,
    allowNull: false,
},
mobileNo: {
    type: DataTypes.STRING,
    allowNull: false,
},
emailId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
},
password: {
    type: DataTypes.STRING,
    allowNull: false,
},
address: {
    type: DataTypes.STRING,
    allowNull: false,
},
status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
},
roleName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'center',
},
}, {
timestamps: true,
});

module.exports = Center;