'use strict'

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const errorHelper = require('@utilities/error-helper')
const paymentValidator = require('@validator/payment.validator')

module.exports = {
    checkout: {
        validate: paymentValidator.checkout,
        pre: [
            {
                assign: 'checkout',
                method: async (request, h) => {
                    try {
                        const { paymentService } = request.server.services();
                        return await paymentService.checkout(request);
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            }
        ],
        handler: async (request, h) => {
            return h.response(request.pre.checkout);
        }
    },
    verification: {
        validate: paymentValidator.verification,
        pre: [
            {
                assign: 'verification',
                method: async (request, h) => {
                    try {
                        const { paymentService } = request.server.services();
                        return await paymentService.verification(request);
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            }
        ],
        handler: async (request, h) => {
            return h.response(request.pre.verification);
        }
    },
    webhook: {
        validate: {},
        pre: [
            {
                assign: 'webhook',
                method: async (request, h) => {
                    try {
                        const { paymentService } = request.server.services();
                        return await paymentService.webhook(request);
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            }
        ],
        handler: async (request, h) => {
            return h.response(request.pre.webhook);
        }
    }
}