const Joi = require("joi");
const { Op } = require("sequelize");
const moment = require("moment");
const Trainer = require("../model/trainer/trainer");

// Validation Schema remains the same
const trainerSchema = Joi.object({
  trainerName: Joi.string().required(),
  dob: Joi.date().required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  email: Joi.string().email().required(),
  phoneNo: Joi.string().required(),
  address: Joi.string().optional(),
  subject: Joi.string().required(),
  experience: Joi.string().required(),
  salary: Joi.number().required(),
  status: Joi.boolean().default(true),
}).messages({
  "string.base": "{{#label}} should be a type of string",
  "string.empty": "{{#label}} cannot be an empty field",
  "any.required": "{{#label}} is a required field",
  "string.email": "{{#label}} must be a valid email",
  "date.base": "{{#label}} should be a valid date",
  "number.base": "{{#label}} should be a type of number",
});

// Create a trainer
exports.createTrainer = async (req, res) => {
  try {
    const { error } = trainerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const trainer = await Trainer.create(req.body);
    res.status(201).json({
      message: "Trainer created successfully",
      trainer,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the trainer" });
  }
};

// Get All Trainers with Pagination and Search
exports.getTrainers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;
    const whereConditions = {};

    if (search) {
      whereConditions[Op.or] = [
        { trainerName: { [Op.like]: `%${search}%` } },
        { phoneNo: { [Op.like]: `%${search}%` } },
      ];
    }

    const result = await Trainer.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    const formattedRows = result.rows.map((trainer) => ({
      ...trainer.toJSON(),
      createdAt: moment(trainer.createdAt).format("DD-MM-YYYY"),
      updatedAt: moment(trainer.updatedAt).format("DD-MM-YYYY"),
    }));

    res.status(200).json({
      data: formattedRows,
      currentPage: parseInt(page),
      totalPages: Math.ceil(result.count / limit),
      totalRecords: result.count,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching trainers" });
  }
};

// Get Single Trainer
exports.getTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: "trainer not found" });
    }
    res.status(200).json(trainer);
  } catch (error) {
    console.error("Error fetching trainer by ID:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the trainer" });
  }
};

// Update Trainer
exports.updateTrainer = async (req, res) => {
  try {
    const { error } = trainerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    await trainer.update(req.body);
    res.status(200).json({
      message: "Trainer updated successfully",
      trainer,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the trainer" });
  }
};

// Toggle Trainer Status
exports.toggleTrainerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Received status update request:', {
            id: id,
            body: req.body
        });

        const trainer = await Trainer.findByPk(id);
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        console.log('Current trainer status:', trainer.status);
        const newStatus = !trainer.status;
        console.log('New status will be:', newStatus);

        await trainer.update({ status: newStatus });

        res.status(200).json({
            message: `Trainer has been ${newStatus ? 'activated' : 'deactivated'}`,
            status: newStatus,
        });
    } catch (error) {
        console.error('Error toggling trainer status:', error);
        res.status(500).json({
            message: 'An error occurred while updating trainer status',
            error: error.message,
        });
    }
};

// Delete Trainer
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    await trainer.destroy();
    res.status(200).json({ message: "Trainer deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the trainer" });
  }
};
