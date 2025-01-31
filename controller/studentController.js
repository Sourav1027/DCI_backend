const Student = require('../model/student/student');
const Joi = require('joi');
const { Op } = require('sequelize');
const moment = require('moment');

// Validation Schema remains the same
const studentSchema = Joi.object({

    id: Joi.number().optional(),
    centerName: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    dob: Joi.date().required(),
    address: Joi.string().optional(),
    fatherName: Joi.string().optional(),
    motherName: Joi.string().optional(),
    course: Joi.string().required(),
    batch: Joi.string().required(),
    previousEducation: Joi.string().optional(),
    emergencyContact: Joi.string().optional(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    admissionDate: Joi.date().required(),
    fee: Joi.number().required(),
    counsellorName: Joi.string().optional(),
    reference: Joi.string().optional(),
    paymentTerm: Joi.string().required(),
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

// Create a Student
exports.createStudent = async (req, res) => {
    try {
        const { error } = studentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const student = await Student.create(req.body);
        res.status(201).json({
            message: 'Student created successfully',
            student
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the student' });
    }
};

// Get All Students with Pagination and Search
exports.getStudents = async (req, res) => {
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

        const result = await Student.findAndCountAll({
            where: whereConditions,
            limit: parseInt(limit),
            offset,
            order: [["createdAt", "DESC"]],

        });

        const formattedRows = result.rows.map((student) => ({
            ...student.toJSON(),
            createdAt: moment(student.createdAt).format('DD-MM-YYYY'),
            updatedAt: moment(student.updatedAt).format('DD-MM-YYYY'),
        }));

        res.status(200).json({
            data: formattedRows,
            currentPage: parseInt(page),
            totalPages: Math.ceil(result.count / limit),
            totalRecords: result.count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching students' });
    }
};

// Get Single Student
exports.getStudent = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student by ID:', error);
        res.status(500).json({ message: 'An error occurred while fetching the student' });
    }
};

// Update Student
exports.updateStudent = async (req, res) => {
    try {
        const { error } = studentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await student.update(req.body);
        res.status(200).json({
            message: 'Student updated successfully',
            student
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the student' });
    }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await student.destroy();
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the student' });
    }
};

// Toggle Student Status
exports.toggleStudnetStatus = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Received status update request:', {
            id: id,
            body: req.body
        });

        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        console.log('Current student status:', student.status);
        const newStatus = !student.status;
        console.log('New status will be:', newStatus);

        await student.update({ status: newStatus });

        res.status(200).json({
            message: `Student has been ${newStatus ? 'activated' : 'deactivated'}`,
            status: newStatus,
        });
    } catch (error) {
        console.error('Error toggling student status:', error);
        res.status(500).json({
            message: 'An error occurred while updating student status',
            error: error.message,
        });
    }
};
