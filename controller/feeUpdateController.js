const Joi = require('joi');
const { Op } = require('sequelize');
const moment = require('moment'); 
const FeeUpdates = require("../model/feeUpdate/feeUpdate");

// Validation Schema
const feeSchema = Joi.object({
    id: Joi.number().optional(),
    centerName: Joi.string().required(),
    batch: Joi.string().required(),
    course: Joi.string().required(),
    studentName: Joi.string().required(),
    phone: Joi.string().required(),
    modeOfPayment: Joi.string().required(),
    totalAmount: Joi.number().required().min(0),
    receivedAmount: Joi.number().required().min(0),
    pendingAmount: Joi.number().optional(),
    status: Joi.string().valid('Paid', 'Pending').default('Pending'),
}).messages({
    'string.base': '{{#label}} should be a type of string',
    'string.empty': '{{#label}} cannot be an empty field',
    'any.required': '{{#label}} is a required field',
    'number.base': '{{#label}} should be a type of number',
    'number.min': '{{#label}} must be greater than or equal to 0'
});

// Create a Fee Update Entry
exports.createFee = async (req, res) => {
    try {
        const { error } = feeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const pendingAmount = req.body.totalAmount - req.body.receivedAmount;
        const status = pendingAmount === 0 ? 'Paid' : 'Pending';

        const feeUpdate = await FeeUpdates.create({
            ...req.body,
            pendingAmount,
            status
        });

        res.status(201).json({
            success: true,
            message: 'Fee update created successfully',
            data: feeUpdate
        });
    } catch (error) {
        console.error('Error creating fee update:', error);
        res.status(500).json({ 
            success: false,
            message: 'An error occurred while creating the fee update',
            error: error.message 
        });
    }
};

// Get All Fee Updates with Pagination and Search
exports.getFees = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status } = req.query;
        const offset = (page - 1) * limit;
        const whereConditions = {};

        if (search) {
            whereConditions[Op.or] = [
                { centerName: { [Op.like]: `%${search}%` } },
                { batch: { [Op.like]: `%${search}%` } },
                { course: { [Op.like]: `%${search}%` } },
                { studentName: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } }
            ];
        }

        if (status) {
            whereConditions.status = status;
        }

        const result = await FeeUpdates.findAndCountAll({
            where: whereConditions,
            limit: parseInt(limit),
            offset,
            order: [["createdAt", "DESC"]],
        });

        const formattedRows = result.rows.map((fee) => ({
            ...fee.toJSON(),
            createdAt: moment(fee.createdAt).format('DD-MM-YYYY'),
            updatedAt: moment(fee.updatedAt).format('DD-MM-YYYY'),
        }));

        res.status(200).json({
            success: true,
            data: formattedRows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(result.count / limit),
                totalRecords: result.count,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching fee updates:', error);
        res.status(500).json({ 
            success: false,
            message: 'An error occurred while fetching fee updates',
            error: error.message 
        });
    }
};

// Get Single Fee Update
exports.getFeeById = async (req, res) => {
    try {
        const feeUpdate = await FeeUpdates.findByPk(req.params.id);
        if (!feeUpdate) {
            return res.status(404).json({ 
                success: false,
                message: 'Fee update not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: {
                ...feeUpdate.toJSON(),
                createdAt: moment(feeUpdate.createdAt).format('DD-MM-YYYY'),
                updatedAt: moment(feeUpdate.updatedAt).format('DD-MM-YYYY'),
            }
        });
    } catch (error) {
        console.error('Error fetching fee update by ID:', error);
        res.status(500).json({ 
            success: false,
            message: 'An error occurred while fetching the fee update',
            error: error.message 
        });
    }
};

// Update Fee Update Entry
exports.updateFee = async (req, res) => {
    try {
        const { error } = feeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                success: false,
                message: error.details[0].message 
            });
        }

        const feeUpdate = await FeeUpdates.findByPk(req.params.id);
        if (!feeUpdate) {
            return res.status(404).json({ 
                success: false,
                message: 'Fee update not found' 
            });
        }

        const pendingAmount = req.body.totalAmount - req.body.receivedAmount;
        const status = pendingAmount === 0 ? 'Paid' : 'Pending';

        const updatedFee = await feeUpdate.update({
            ...req.body,
            pendingAmount,
            status
        });

        res.status(200).json({
            success: true,
            message: 'Fee update updated successfully',
            data: updatedFee
        });
    } catch (error) {
        console.error('Error updating fee update:', error);
        res.status(500).json({ 
            success: false,
            message: 'An error occurred while updating the fee update',
            error: error.message 
        });
    }
};

// Delete Fee Update Entry
exports.deleteFee = async (req, res) => {
    try {
        const feeUpdate = await FeeUpdates.findByPk(req.params.id);
        if (!feeUpdate) {
            return res.status(404).json({ 
                success: false,
                message: 'Fee update not found' 
            });
        }

        await feeUpdate.destroy();
        res.status(200).json({ 
            success: true,
            message: 'Fee update deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting fee update:', error);
        res.status(500).json({ 
            success: false,
            message: 'An error occurred while deleting the fee update',
            error: error.message 
        });
    }
};