const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const SMS = sequelize.define(
  "SMS",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    centerName: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    course: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    batch: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    selectStudent: { 
      type: DataTypes.JSON,  // Will store array of student objects
      allowNull: false,
      validate: {
        isStudentArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('selectStudent must be an array');
          }
          // Validate each element is an object
          value.forEach(student => {
            if (typeof student !== 'object' || student === null) {
              throw new Error('Each student must be an object');
            }
          });
        }
      }
    },
    message: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = SMS;