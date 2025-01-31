const Syllabus = require('../model/syllabus/syllabus');
const Joi = require('joi');
const { Op } = require('sequelize');
const moment = require('moment');

// Validation Schema remains the same
const syllabusSchema = Joi.object({

    id: Joi.number().optional(),
    batch: Joi.string().required(),
    course: Joi.string().required(),
    topics: Joi.string().required(),
    status: Joi.boolean().default(true),
}).messages({
    'string.base': '{{#label}} should be a type of string',
    'string.empty': '{{#label}} cannot be an empty field',
    'any.required': '{{#label}} is a required field',
    'string.email': '{{#label}} must be a valid email',
    'date.base': '{{#label}} should be a valid date',
    'number.base': '{{#label}} should be a type of number'
});

// Create a syllabus
exports.createSyllabus = async (req, res) => {
    try {
        const { error } = syllabusSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const syllabus = await Syllabus.create(req.body);
        res.status(201).json({
            message: 'syllabus created successfully',
            syllabus
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the syllabus' });
    }
};

// Get All syllabuss with Pagination and Search
exports.getsyllabus = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;
        const whereConditions = {};

        if (search) {
            whereConditions[Op.or] = [
                { batch: { [Op.like]: `%${search}%` } },
                { course: { [Op.like]: `%${search}%` } },
            ];
        }

        const result = await Syllabus.findAndCountAll({
            where: whereConditions,
            limit: parseInt(limit),
            offset,
            order: [["createdAt", "DESC"]],

        });

        const formattedRows = result.rows.map((syllabus) => ({
            ...syllabus.toJSON(),
            createdAt: moment(syllabus.createdAt).format('DD-MM-YYYY'),
            updatedAt: moment(syllabus.updatedAt).format('DD-MM-YYYY'),
        }));

        res.status(200).json({
            data: formattedRows,
            currentPage: parseInt(page),
            totalPages: Math.ceil(result.count / limit),
            totalRecords: result.count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching syllabus' });
    }
};

// Get Single syllabus
exports.getsyllabusbyId = async (req, res) => {
    try {
        const syllabus = await Syllabus.findByPk(req.params.id);
        if (!syllabus) {
            return res.status(404).json({ message: 'syllabus not found' });
        }
        res.status(200).json(syllabus);
    } catch (error) {
        console.error('Error fetching syllabus by ID:', error);
        res.status(500).json({ message: 'An error occurred while fetching the syllabus' });
    }
};

// Update syllabus
exports.updatesyllabus = async (req, res) => {
    try {
        const { error } = syllabusSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const syllabus = await Syllabus.findByPk(req.params.id);
        if (!syllabus) {
            return res.status(404).json({ message: 'syllabus not found' });
        }

        await syllabus.update(req.body);
        res.status(200).json({
            message: 'syllabus updated successfully',
            syllabus
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the syllabus' });
    }
};

// Delete syllabus
exports.deletesyllabus = async (req, res) => {
    try {
        const syllabus = await Syllabus.findByPk(req.params.id);
        if (!syllabus) {
            return res.status(404).json({ message: 'syllabus not found' });
        }

        await syllabus.destroy();
        res.status(200).json({ message: 'syllabus deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the syllabus' });
    }
};

// Toggle syllabus Status
exports.toggleSyllabusStatus = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Received status update request:', {
            id: id,
            body: req.body
        });

        const syllabus = await Syllabus.findByPk(id);
        if (!syllabus) {
            return res.status(404).json({ message: 'syllabus not found' });
        }

        console.log('Current syllabus status:', syllabus.status);
        const newStatus = !syllabus.status;
        console.log('New status will be:', newStatus);

        await syllabus.update({ status: newStatus });

        res.status(200).json({
            message: `syllabus has been ${newStatus ? 'activated' : 'deactivated'}`,
            status: newStatus,
        });
    } catch (error) {
        console.error('Error toggling syllabus status:', error);
        res.status(500).json({
            message: 'An error occurred while updating syllabus status',
            error: error.message,
        });
    }
};
