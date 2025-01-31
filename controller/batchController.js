const Joi = require("joi");
const moment = require("moment");
const { Op } = require("sequelize");
const Batch = require("../model/batch/batch");

// Joi validation schemas
const BatchSchema = Joi.object({
  batchName: Joi.string().min(3).required().messages({
    "string.base": '"batchName" should be a type of string',
    "string.empty": '"batchName" cannot be an empty field',
    "string.min": '"batchName" should have a minimum length of 3 characters',
    "any.required": '"batchName" is a required field',
  }),
  timing: Joi.string().min(1).required().messages({
    "string.base": '"timing" should be a type of string',
    "string.empty": '"timing" cannot be an empty field',
    "any.required": '"timing" is a required field',
  }),
  course: Joi.string().min(3).required().messages({
    "string.base": '"course" should be a type of string',
    "string.empty": '"course" cannot be an empty field',
    "string.min": '"course" should have a minimum length of 3 characters',
    "any.required": '"course" is a required field',
  }),
  startsAt: Joi.string().min(3).required().messages({
    "string.base": '"startsAt" should be a type of string',
    "string.empty": '"startsAt" cannot be an empty field',
    "string.min": '"startsAt" should have a minimum length of 3 characters',
    "any.required": '"startsAt" is a required field',
  }),
  status: Joi.boolean().default(true),
});

// Create a new batch
exports.createBatch = async (req, res) => {
  try {
    const { batchName, timing, course, startsAt } = req.body;

    // Validate input data
    const { error } = BatchSchema.validate({
      batchName,
      timing,
      course,
      startsAt,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Create the new batch
    const batch = await Batch.create({
      batchName,
      timing,
      course,
      startsAt,
      status: true // Set default status to true for new batches
    });

    res.status(201).json({
      message: "Batch created successfully",
      batch,
    });
  } catch (error) {
    console.error("Error creating batch:", error);
    res.status(500).json({ 
      message: "An error occurred while creating the batch",
      error: error.message 
    });
  }
};

// Get all batches with pagination and search
exports.getBatches = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const offset = (page - 1) * limit;
    const whereConditions = {};

    if (search) {
      whereConditions[Op.or] = [
        { batchName: { [Op.like]: `%${search}%` } },
        { course: { [Op.like]: `%${search}%` } },
      ];
    }

    const result = await Batch.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']], // Latest batches first
    });

    const formattedRows = result.rows.map((batch) => ({
      ...batch.toJSON(),
      createdAt: moment(batch.createdAt).format("DD-MM-YYYY"),
      updatedAt: moment(batch.updatedAt).format("DD-MM-YYYY"),
    }));

    res.status(200).json({
      data: formattedRows,
      currentPage: parseInt(page),
      totalPages: Math.ceil(result.count / limit),
      totalRecords: result.count,
    });
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ 
      message: "An error occurred while fetching batches",
      error: error.message 
    });
  }
};

// Get a batch by ID
exports.getBatchById = async (req, res) => {
  try {
    const id = req.params.id;

    const batch = await Batch.findByPk(id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json(batch);
  } catch (error) {
    console.error("Error fetching batch by ID:", error);
    res.status(500).json({ 
      message: "An error occurred while fetching the batch",
      error: error.message 
    });
  }
};

// Update a batch
exports.updateBatch = async (req, res) => {
  try {
    const id = req.params.id;
    const { batchName, timing, course, startsAt, status } = req.body;

    // Validate input data
    const { error } = BatchSchema.validate({
      batchName, 
      timing, 
      course, 
      startsAt,
      status
    });
    
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const batch = await Batch.findByPk(id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    await batch.update({
      batchName, 
      timing, 
      course, 
      startsAt,
      status
    });

    res.status(200).json({
      message: "Batch updated successfully",
      batch,
    });
  } catch (error) {
    console.error("Error updating batch:", error);
    res.status(500).json({ 
      message: "An error occurred while updating the batch",
      error: error.message 
    });
  }
};

// Toggle batch status
exports.toggleBatchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Toggle the status
    await batch.update({ status: !batch.status });

    res.status(200).json({ 
      message: `Batch has been ${batch.status ? 'activated' : 'deactivated'}`,
      status: batch.status
    });
  } catch (error) {
    console.error("Error toggling batch status:", error);
    res.status(500).json({ 
      message: 'An error occurred while updating batch status',
      error: error.message 
    });
  }
};

// Delete a batch
exports.deleteBatch = async (req, res) => {
  try {
    const id = req.params.id;
    const batch = await Batch.findByPk(id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    await batch.destroy();
    res.status(200).json({ message: "Batch deleted successfully" });
  } catch (error) {
    console.error("Error deleting batch:", error);
    res.status(500).json({ 
      message: "An error occurred while deleting the batch",
      error: error.message 
    });
  }
};