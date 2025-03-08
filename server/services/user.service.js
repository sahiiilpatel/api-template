'use strict'

const Joi = require('joi')
const Bcrypt = require('bcrypt')
const Boom = require('@hapi/boom')
Joi.objectId = require('joi-objectid')(Joi)
const Schmervice = require('@hapipal/schmervice')
const { errors } = require('@utilities/constants')
const errorHelper = require('@utilities/error-helper')

const User = require('@models/user.model').schema

module.exports = class UserService extends Schmervice.Service {

  async findByCredentials(username, password) {
    try {
      const query = {
        email: username
      };
      const selectField = "firstName lastName email password role avatar subscription coverImage refreshToken updatedAt createdAt deleted"
      const mongooseQuery = User.findOne(query).select(selectField);
      const user = await mongooseQuery.lean();
      if (!user) {
        const errorObj = {};
        errorObj.email = errors.user.wrongEmail.message;
        await errorHelper.setCustomError(errorObj);
      }
      const source = user.password;
      if (!source) errorHelper.handleError(Boom.badRequest("Please setup your password !"))
      const passwordMatch = await Bcrypt.compare(password, source);
      if (passwordMatch) {
        return user;
      } else {
        const errorObj = {};
        errorObj.password = errors.user.wrongPassword.message;
        await errorHelper.setCustomError(errorObj);
      }
    } catch (err) {
      errorHelper.handleError(err);
    }
  }
}
