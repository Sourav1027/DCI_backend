const Joi = require('joi');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Center = require('../model/center/center');
const moment = require('moment');
const jwt = require('jsonwebtoken');

// Validation Schema
const centerSchema = Joi.object({
      id: Joi.number().optional(),
  
  centerId: Joi.string().required(),
  centerName: Joi.string().required(),
  ownerName: Joi.string().required(),
  mobileNo: Joi.string().pattern(/^[0-9]{10}$/).required(),
  emailId: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  address: Joi.string().required(),
  status: Joi.boolean().default(true),
  roleName: Joi.string().default("center"), // Default value

});


// Create Center
exports.createCenter = async (req, res) => {
  try {
    const { error } = centerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    req.body.password = await bcrypt.hash(req.body.password, 10);
    const center = await Center.create(req.body);
    res.status(201).json({ message: 'Center created successfully', center });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the center' });
  }
};

// Get Centers
exports.getCenters = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;
    const whereConditions = search ? { [Op.or]: [{ centerName: { [Op.like]: `%${search}%` } }, { ownerName: { [Op.like]: `%${search}%` } }] } : {};
    
    const result = await Center.findAndCountAll({ where: whereConditions, limit: parseInt(limit), offset, order: [['createdAt', 'DESC']] });
    const totalPages = Math.ceil(result.count / limit);
    const formattedRows = result.rows.map(center => ({
      ...center.toJSON(),
      createdAt: moment(center.createdAt).format('DD-MM-YYYY'),
      updatedAt: moment(center.updatedAt).format('DD-MM-YYYY')
    }));
    
    res.status(200).json({ data: formattedRows, currentPage: parseInt(page), totalPages, totalRecords: result.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching centers' });
  }
};

// Get Center by ID
exports.getCenterById = async (req, res) => {
  try {
    const { id } = req.params;
    const center = await Center.findOne({ where: { centerId: id } });
    if (!center) return res.status(404).json({ message: 'Center not found' });
    res.status(200).json({ ...center.toJSON(), createdAt: moment(center.createdAt).format('DD-MM-YYYY'), updatedAt: moment(center.updatedAt).format('DD-MM-YYYY') });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the center' });
  }
};

// Update Center
exports.updateCenter = async (req, res) => {
  try {
    const { error } = centerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    
    const center = await Center.findByPk(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });
    
    await center.update(req.body);
    res.status(200).json({ message: 'Center updated successfully', center });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the center' });
  }
};

// Delete Center
exports.deleteCenter = async (req, res) => {
  try {
    const center = await Center.findByPk(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });
    await center.destroy();
    res.status(200).json({ message: 'Center deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the center' });
  }
};

// Suspend Center
exports.suspendCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const center = await Center.findOne({ where: { centerId: id } });
    if (!center) return res.status(404).json({ message: 'Center not found' });
    if (!center.status) return res.status(400).json({ message: 'Center is already suspended' });
    await center.update({ status: false });
    res.status(200).json({ message: 'Center has been suspended' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while suspending the center' });
  }
};

// Unsuspend Center
exports.unsuspendCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const center = await Center.findOne({ where: { centerId: id } });
    if (!center) return res.status(404).json({ message: 'Center not found' });
    if (center.status) return res.status(400).json({ message: 'Center is already active' });
    await center.update({ status: true });
    res.status(200).json({ message: 'Center has been activated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while unsuspending the center' });
  }
};
