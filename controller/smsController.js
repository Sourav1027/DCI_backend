const SMS = require('../model/sms/sms');
const Joi = require('joi');
const { Op } = require('sequelize');
const moment = require('moment');

// Validation Schema
const smsSchema = Joi.object({
    id: Joi.number().optional(),
    centerName: Joi.string().required(),
    course: Joi.string().required(),
    batch: Joi.string().required(),
    selectStudent: Joi.array().items(
        Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
            // Add any other student properties you want to validate
        })
    ).required(),
    message: Joi.string().allow('').optional(),
    status: Joi.boolean().default(true)
}).messages({
    'string.base': '{{#label}} should be a type of string',
    'string.empty': '{{#label}} cannot be an empty field',
    'any.required': '{{#label}} is a required field',
    'array.base': '{{#label}} should be an array',
    'number.base': '{{#label}} should be a type of number'
});

// Create SMS
exports.createSMS = async (req, res) => {
    try {
        const { error } = smsSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const sms = await SMS.create(req.body);
        res.status(201).json({
            message: 'SMS created successfully',
            sms
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the SMS' });
    }
};

// Get All SMS with Pagination and Search
exports.getSMS = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;
        const whereConditions = {};

        if (search) {
            whereConditions[Op.or] = [
                { centerName: { [Op.like]: `%${search}%` } },
                { course: { [Op.like]: `%${search}%` } },
                { batch: { [Op.like]: `%${search}%` } },
            ];
        }

        const result = await SMS.findAndCountAll({
            where: whereConditions,
            limit: parseInt(limit),
            offset,
            order: [["createdAt", "DESC"]],
        });

        const formattedRows = result.rows.map((sms) => ({
            ...sms.toJSON(),
            createdAt: moment(sms.createdAt).format('DD-MM-YYYY'),
            updatedAt: moment(sms.updatedAt).format('DD-MM-YYYY'),
        }));

        res.status(200).json({
            data: formattedRows,
            currentPage: parseInt(page),
            totalPages: Math.ceil(result.count / limit),
            totalRecords: result.count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching SMS records' });
    }
};

// Get Single SMS
exports.getSMSById = async (req, res) => {
    try {
        const sms = await SMS.findByPk(req.params.id);
        if (!sms) {
            return res.status(404).json({ message: 'SMS not found' });
        }
        res.status(200).json(sms);
    } catch (error) {
        console.error('Error fetching SMS by ID:', error);
        res.status(500).json({ message: 'An error occurred while fetching the SMS' });
    }
};

// Update SMS
exports.updateSMS = async (req, res) => {
    try {
        const { error } = smsSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const sms = await SMS.findByPk(req.params.id);
        if (!sms) {
            return res.status(404).json({ message: 'SMS not found' });
        }

        await sms.update(req.body);
        res.status(200).json({
            message: 'SMS updated successfully',
            sms
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the SMS' });
    }
};

// Delete SMS
exports.deleteSMS = async (req, res) => {
    try {
        const sms = await SMS.findByPk(req.params.id);
        if (!sms) {
            return res.status(404).json({ message: 'SMS not found' });
        }

        await sms.destroy();
        res.status(200).json({ message: 'SMS deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the SMS' });
    }
};

// Toggle SMS Status
exports.toggleSMSStatus = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Received status update request:', {
            id: id,
            body: req.body
        });

        const sms = await SMS.findByPk(id);
        if (!sms) {
            return res.status(404).json({ message: 'SMS not found' });
        }

        console.log('Current SMS status:', sms.status);
        const newStatus = !sms.status;
        console.log('New status will be:', newStatus);

        await sms.update({ status: newStatus });

        res.status(200).json({
            message: `SMS has been ${newStatus ? 'activated' : 'deactivated'}`,
            status: newStatus,
        });
    } catch (error) {
        console.error('Error toggling SMS status:', error);
        res.status(500).json({
            message: 'An error occurred while updating SMS status',
            error: error.message,
        });
    }
}; 