const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().required(),
    roleName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    address: Joi.string().optional(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
});


exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }
    next();
};
