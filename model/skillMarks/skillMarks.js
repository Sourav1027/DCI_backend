const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const SkillMarks = sequelize.define(
  "SkillMarks",
  {
    id: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
    centerName: { type: DataTypes.STRING, allowNull: false },
    course: { type: DataTypes.STRING, allowNull: false },
    batch: { type: DataTypes.STRING, allowNull: false },
    studentName: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false, unique: true },
    resumeCreation: { type: DataTypes.STRING, allowNull: false },
    presentation: { type: DataTypes.STRING, allowNull: false },
    groupDiscussion: { type: DataTypes.STRING, allowNull: false },
    technical: { type: DataTypes.STRING, allowNull: false },
    mockInterview: { type: DataTypes.STRING, allowNull: false },
    status: {type: DataTypes.BOOLEAN,allowNull: false,defaultValue: true},
  },
  {
    timestamps: true,
  }
);

module.exports = SkillMarks;
