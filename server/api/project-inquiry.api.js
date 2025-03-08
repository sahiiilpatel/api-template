'use strict'

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const errorHelper = require('@utilities/error-helper')
const projectInquiryValidator = require('@validator/project-inquiry.validator')

module.exports = {
    projectInquiry: {
        validate: projectInquiryValidator.projectInquiry,
        pre: [
            {
                assign: 'projectInquiry',
                method: async (request, h) => {
                    try {
                        const { projectInquiryService } = request.server.services();
                        return await projectInquiryService.projectInquiry(request);
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            }
        ],
        handler: async (request, h) => {
            return h.response(request.pre.projectInquiry);
        }
    }
}