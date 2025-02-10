const Enquiry = require('../model/enquiry/enquiry');
const Joi = require('joi');
const { Op } = require('sequelize');
const moment = require('moment');

// Validation Schema remains the same
const enquirySchema = Joi.object({

    id: Joi.number().optional(),
    centerName: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    dob: Joi.date().required(),
    address: Joi.string().optional(),
    course: Joi.string().required(),
    batch: Joi.string().required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    counsellorName: Joi.string().optional(),
    professional: Joi.string().optional(),
    preferTiming: Joi.string().required(),
    collegeName: Joi.string().optional(),
    status: Joi.boolean().default(true),
}).messages({
    'string.base': '{{#label}} should be a type of string',
    'string.empty': '{{#label}} cannot be an empty field',
    'any.required': '{{#label}} is a required field',
    'string.email': '{{#label}} must be a valid email',
    'date.base': '{{#label}} should be a valid date',
    'number.base': '{{#label}} should be a type of number'
});

// Create a Enquiry
exports.createEnquiry = async (req, res) => {
    try {
        const { error } = enquirySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const enquiry = await Enquiry.create(req.body);
        res.status(201).json({
            message: 'Enquiry created successfully',
            enquiry
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the enquiry' });
    }
};

// Get All Students with Pagination and Search
exports.getEnquiry = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;
        const whereConditions = {};

        if (search) {
            whereConditions[Op.or] = [
                { firstName: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } },
            ];
        }

        const result = await Enquiry.findAndCountAll({
            where: whereConditions,
            limit: parseInt(limit),
            offset,
            order: [["createdAt", "DESC"]],

        });

        const formattedRows = result.rows.map((enquiry) => ({
            ...enquiry.toJSON(),
            createdAt: moment(enquiry.createdAt).format('DD-MM-YYYY'),
            updatedAt: moment(enquiry.updatedAt).format('DD-MM-YYYY'),
        }));

        res.status(200).json({
            data: formattedRows,
            currentPage: parseInt(page),
            totalPages: Math.ceil(result.count / limit),
            totalRecords: result.count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching enquiry' });
    }
};

// Get Single Enquiry
exports.getEnquirybyID = async (req, res) => {
    try {
        const student = await Enquiry.findByPk(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        res.status(200).json(enquiry);
    } catch (error) {
        console.error('Error fetching enquiry by ID:', error);
        res.status(500).json({ message: 'An error occurred while fetching the enquiry' });
    }
};

// Update Enquiry
exports.updateEnquiry = async (req, res) => {
    try {
        const { error } = enquirySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const enquiry = await Enquiry.findByPk(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        await enquiry.update(req.body);
        res.status(200).json({
            message: 'Enquiry updated successfully',
            enquiry
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the enquiry' });
    }
};

// Delete enquiry
exports.deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByPk(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        await enquiry.destroy();
        res.status(200).json({ message: 'Enquiry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the enquiry' });
    }
};

// Toggle Enquiry Status
exports.toggleEnquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Received status update request:', {
            id: id,
            body: req.body
        });

        const enquiry = await Enquiry.findByPk(id);
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        console.log('Current enquiry status:', enquiry.status);
        const newStatus = !enquiry.status;
        console.log('New status will be:', newStatus);

        await enquiry.update({ status: newStatus });

        res.status(200).json({
            message: `Enquiry has been ${newStatus ? 'activated' : 'deactivated'}`,
            status: newStatus,
        });
    } catch (error) {
        console.error('Error toggling enquiry status:', error);
        res.status(500).json({
            message: 'An error occurred while updating enquiry status',
            error: error.message,
        });
    }
};
