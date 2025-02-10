const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const Remarks = sequelize.define(
  "Remarks",
  {
    id: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
    enquiryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'enquiries',
          key: 'id'
        }},
    remarks: {type: DataTypes.TEXT,allowNull: false  },
    status: {type: DataTypes.BOOLEAN,allowNull: false,defaultValue: true},
  },
  {
    timestamps: true,
  }
);

module.exports = Remarks;
