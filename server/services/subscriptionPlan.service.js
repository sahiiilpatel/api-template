'use strict'

const Joi = require('joi')
const Boom = require('@hapi/boom')
Joi.objectId = require('joi-objectid')(Joi)
const Schmervice = require('@hapipal/schmervice')
const errorHelper = require('@utilities/error-helper')

const SubscriptionPlanModel = require('@models/subscription-plan.model').schema

module.exports = class SubscriptionPlanService extends Schmervice.Service {

  async subscriptionPlanList(request) {
    try {
      const data = await SubscriptionPlanModel.find({});
      return data
    } catch (err) {
      errorHelper.handleError(err);
    }
  }
}
