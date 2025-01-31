const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const Student = sequelize.define(
  "Student",
  {
    id: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
    centerName: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false, unique: true },
    dob: { type: DataTypes.DATE, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: true },
    fatherName: { type: DataTypes.STRING, allowNull: true },
    motherName: { type: DataTypes.STRING, allowNull: true },
    course: { type: DataTypes.STRING, allowNull: false },
    batch: { type: DataTypes.STRING, allowNull: false },
    previousEducation: { type: DataTypes.STRING, allowNull: true },
    emergencyContact: { type: DataTypes.STRING, allowNull: true },
    gender: { type: DataTypes.STRING, allowNull: false },
    admissionDate: { type: DataTypes.DATE, allowNull: false },
    fee: { type: DataTypes.FLOAT, allowNull: false },
    counsellorName: { type: DataTypes.STRING, allowNull: true },
    reference: { type: DataTypes.STRING, allowNull: true },
    paymentTerm: { type: DataTypes.STRING, allowNull: false },
    collegeName: { type: DataTypes.STRING, allowNull: true },
    status: {type: DataTypes.BOOLEAN,allowNull: false,defaultValue: true},
  },
  {
    timestamps: true,
  }
);

module.exports = Student;
