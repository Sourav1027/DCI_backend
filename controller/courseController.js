const Joi = require('joi');
const moment = require('moment');
const { Op } = require('sequelize');
const Course = require('../model/course/course');

// Joi validation schemas
const courseSchema = Joi.object({
  courseName: Joi.string().min(3).required().messages({
    'string.base': '"courseName" should be a type of string',
    'string.empty': '"courseName" cannot be an empty field',
    'string.min': '"courseName" should have a minimum length of 3 characters',
    'any.required': '"courseName" is a required field',
  }),
  duration: Joi.string().min(1).required().messages({
    'string.base': '"duration" should be a type of string',
    'string.empty': '"duration" cannot be an empty field',
    'any.required': '"duration" is a required field',
  }),
  courseFee: Joi.number().positive().required().messages({
    'number.base': '"courseFee" should be a type of number',
    'number.positive': '"courseFee" should be a positive number',
    'any.required': '"courseFee" is a required field',
  }),
    status: Joi.boolean().default(true),
});

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { courseName, duration, courseFee } = req.body;

    // Validate input data
    const { error } = courseSchema.validate({ courseName, duration, courseFee });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Create the new course
    const course = await Course.create({
      courseName,
      duration,
      courseFee,
      status: true
    });

    res.status(201).json({
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the course' });
  }
};

// Get all courses with pagination and search
exports.getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const offset = (page - 1) * limit;
    const whereConditions = {};

    if (search) {
      whereConditions[Op.or] = [
        { courseName: { [Op.like]: `%${search}%` } },
    
      ];
    }

    const result = await Course.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    const formattedRows = result.rows.map((course) => ({
      ...course.toJSON(),
      createdAt: moment(course.createdAt).format('DD-MM-YYYY'),
      updatedAt: moment(course.updatedAt).format('DD-MM-YYYY'),
    }));

    res.status(200).json({
      data: formattedRows,
      currentPage: parseInt(page),
      totalPages: Math.ceil(result.count / limit),
      totalRecords: result.count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching courses' });
  }
};

// Get a course by ID
exports.getCourseById = async (req, res) => {
  try {
    const id = req.params.id;

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    res.status(500).json({ message: 'An error occurred while fetching the course' });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const { courseName, duration, courseFee,status } = req.body;

    // Validate input data
    const { error } = courseSchema.validate({ courseName, duration, courseFee,status });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.update({
      courseName,
      duration,
      courseFee,status
    });

    res.status(200).json({
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the course' });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.destroy();
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the course' });
  }
};

// Toggle course status
exports.toggleCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Toggle the status
    await course.update({ status: !course.status });

    res.status(200).json({ 
      message: `Course has been ${course.status ? 'activated' : 'deactivated'}`,
      status: course.status
    });
  } catch (error) {
    console.error("Error toggling course status:", error);
    res.status(500).json({ 
      message: 'An error occurred while updating course status',
      error: error.message 
    });
  }
};