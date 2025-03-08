'use strict'

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const errorHelper = require('@utilities/error-helper')
const paymentValidator = require('@validator/dashboard.validator')

module.exports = {
    dashboard: {
        validate: paymentValidator.dashboard,
        pre: [
            {
                assign: 'dashboard',
                method: async (request, h) => {
                    try {
                        const { dashboardService } = request.server.services();
                        return await dashboardService.dashboard(request);
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            }
        ],
        handler: async (request, h) => {
            return h.response(request.pre.dashboard);
        }
    }
}