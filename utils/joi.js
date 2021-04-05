const Joi = require('joi')

const generalParams = {
    id: Joi.number().integer().required().min(1),
    year: Joi.number().integer(),
    categories: Joi.string().pattern(new RegExp('^[a-z][a-z_,]*[a-z]$')),
}

module.exports = {
    generalParams
}