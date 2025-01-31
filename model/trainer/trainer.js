const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const Trainer = sequelize.define(
  "Trainer",
  {
    id: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
    trainerName: { type: DataTypes.STRING, allowNull: false },
    dob: { type: DataTypes.DATE, allowNull: false },   
    gender: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phoneNo: { type: DataTypes.STRING, allowNull: false, unique: true },
    address: { type: DataTypes.STRING, allowNull: true },
    subject: { type: DataTypes.STRING, allowNull: true },
    experience: { type: DataTypes.STRING, allowNull: true },
    salary: { type: DataTypes.FLOAT, allowNull: false },
    status: {type: DataTypes.BOOLEAN,allowNull: false,defaultValue: true},
  },
  
  {
    timestamps: true,
  }
);

module.exports = Trainer;
