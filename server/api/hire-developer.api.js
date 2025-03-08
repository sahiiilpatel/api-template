'use strict'

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const errorHelper = require('@utilities/error-helper')
const hireDeveloperValidator = require('@validator/hire-developer.validator')

module.exports = {
    hireDeveloper: {
        validate: hireDeveloperValidator.hireDeveloper,
        pre: [
            {
                assign: 'hireDeveloper',
                method: async (request, h) => {
                    try {
                        const { hireDeveloperService } = request.server.services();
                        return await hireDeveloperService.hireDeveloper(request);
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            }
        ],
        handler: async (request, h) => {
            return h.response(request.pre.hireDeveloper);
        }
    }
}