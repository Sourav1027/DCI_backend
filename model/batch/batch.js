const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Batches = sequelize.define('Batch', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
},
  batchName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timing: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  course: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startsAt: {
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


module.exports = Batches;
