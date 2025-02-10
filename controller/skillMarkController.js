const Joi = require('joi');
const { Op } = require('sequelize');
const moment = require('moment');
const SkillMarks = require('../model/skillMarks/skillMarks');

// Validation Schema
const skillSchema = Joi.object({
    id: Joi.number().optional(),
    centerName: Joi.string().required(),
    course: Joi.string().required(),
    batch: Joi.string().required(),
    studentName: Joi.string().required(),
    phone: Joi.string().required(),
    resumeCreation: Joi.string().optional(),
    presentation: Joi.string().optional(),
    groupDiscussion: Joi.string().required(),
    technical: Joi.string().required(),
    mockInterview: Joi.string().optional(),
    status: Joi.boolean().default(true),
}).messages({
    'string.base': '{{#label}} should be a type of string',
    'string.empty': '{{#label}} cannot be an empty field',
    'any.required': '{{#label}} is a required field',
    'string.email': '{{#label}} must be a valid email',
    'number.base': '{{#label}} should be a type of number'
});

// Create Skill
exports.createSkill = async (req, res) => {
    try {
        const { error } = skillSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const skill = await SkillMarks.create(req.body);
        res.status(201).json({
            message: 'Skill created successfully',
            skill
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the skill' });
    }
};

// Get All Skills with Pagination and Search
exports.getSkills = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;
        const whereConditions = {};

        if (search) {
            whereConditions[Op.or] = [
                { studentName: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } },
            ];
        }

        const result = await SkillMarks.findAndCountAll({
            where: whereConditions,
            limit: parseInt(limit),
            offset,
            order: [["createdAt", "DESC"]],
        });

        const formattedRows = result.rows.map((skill) => ({
            ...skill.toJSON(),
            createdAt: moment(skill.createdAt).format('DD-MM-YYYY'),
            updatedAt: moment(skill.updatedAt).format('DD-MM-YYYY'),
        }));

        res.status(200).json({
            data: formattedRows,
            currentPage: parseInt(page),
            totalPages: Math.ceil(result.count / limit),
            totalRecords: result.count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching skills' });
    }
};

// Get Single SkillMarks by ID
exports.getSkillByID = async (req, res) => {
    try {
        const skill = await SkillMarks.findByPk(req.params.id);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.status(200).json(skill);
    } catch (error) {
        console.error('Error fetching skill by ID:', error);
        res.status(500).json({ message: 'An error occurred while fetching the skill' });
    }
};

// Update Skill
exports.updateSkill = async (req, res) => {
    try {
        const { error } = skillSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const skill = await SkillMarks.findByPk(req.params.id);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        await skill.update(req.body);
        res.status(200).json({
            message: 'Skill updated successfully',
            skill
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the skill' });
    }
};

// Delete Skill
exports.deleteSkill = async (req, res) => {
    try {
        const skill = await SkillMarks.findByPk(req.params.id);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        await skill.destroy();
        res.status(200).json({ message: 'Skill deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the skill' });
    }
};

// Toggle Skill Status
exports.toggleSkillStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const skill = await SkillMarks.findByPk(id);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        const newStatus = !skill.status;
        await skill.update({ status: newStatus });

        res.status(200).json({
            message: `Skill has been ${newStatus ? 'activated' : 'deactivated'}`,
            status: newStatus,
        });
    } catch (error) {
        console.error('Error toggling skill status:', error);
        res.status(500).json({
            message: 'An error occurred while updating skill status',
            error: error.message,
        });
    }
};
