'use strict'

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const errorHelper = require('@utilities/error-helper')
const subscriptionPlanValidator = require('@validator/subscription-plan.validator')

// const subscriptionPlanValidator = require('@models/user.model').schema

module.exports = {
    subscriptionPlanList: {
        validate: {},
        pre: [
            {
                assign: 'subscriptionPlanList',
                method: async (request, h) => {
                    try {
                        const { subscriptionPlanService } = request.server.services();
                        return await subscriptionPlanService.subscriptionPlanList(request);
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            }
        ],
        handler: async (request, h) => {
            return h.response(request.pre.subscriptionPlanList);
        }
    }
}