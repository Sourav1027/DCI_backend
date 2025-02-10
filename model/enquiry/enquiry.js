const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const Enquiry = sequelize.define(
  "Enquiry",
  {
    id: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
    centerName: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false, unique: true },
    dob: { type: DataTypes.DATE, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: true },
    course: { type: DataTypes.STRING, allowNull: false },
    batch: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    collegeName: { type: DataTypes.STRING, allowNull: true },
    counsellorName: { type: DataTypes.STRING, allowNull: true },
    professional: { type: DataTypes.STRING, allowNull: true },
    preferTiming: { type: DataTypes.STRING, allowNull: false },
    status: {type: DataTypes.BOOLEAN,allowNull: false,defaultValue: true},
  },
  {
    timestamps: true,
  }
);

module.exports = Enquiry;
