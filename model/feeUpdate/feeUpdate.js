const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const FeeUpdates = sequelize.define('FeeUpdate', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    centerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    course: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    batch: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    studentName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    modeOfPayment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    receivedAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    pendingAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Paid', 'Pending'),
        allowNull: false,
        defaultValue: 'Pending',
    },
}, {
    timestamps: true,
    hooks: {
        beforeValidate: (feeUpdate) => {
            feeUpdate.pendingAmount = feeUpdate.totalAmount - feeUpdate.receivedAmount;
            feeUpdate.status = feeUpdate.pendingAmount === 0 ? 'Paid' : 'Pending';
        },
    }
});

module.exports = FeeUpdates;
