const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Syllabuses = sequelize.define('Syllabus', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
},
  batch: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  course: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  topics: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
},
  
},
{
    timestamps: true,
  });


module.exports = Syllabuses;
