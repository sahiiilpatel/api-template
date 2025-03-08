'use strict'

const Joi = require('joi')
const config = require('config')
const Boom = require('@hapi/boom')
Joi.objectId = require('joi-objectid')(Joi)
const Token = require('@utilities/create-token')
const { errors } = require('@utilities/constants')
const errorHelper = require('@utilities/error-helper')
const authValidator = require('@validator/auth.validator')

const User = require('@models/user.model').schema

module.exports = {
    login: {
        validate: authValidator.login,
        pre: [
            {
                assign: 'loginUser',
                method: async (request, h) => {
                    try {
                        const email = request.payload.email
                        const password = request.payload.password
                        const { userService } = request.server.services()
                        const user = await userService.findByCredentials(email, password)
                        if (user) {
                            return user
                        } else {
                            errorHelper.handleError(Boom.badRequest('Wrong email or password'))
                        }
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            },
            {
                assign: 'accessToken',
                method: (request, h) => {
                    try {
                        return Token(request.pre.loginUser, config.constants.EXPIRATION_PERIOD)
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            },
            {
                assign: 'refreshToken',
                method: async (request, h) => {
                    const User = require('@models/user.model').schema
                    try {
                        const user = await User.findById(request.pre.loginUser._id);
                        return await user.generateRefreshToken();
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            }
        ],
        handler: async (request, h) => {
            let response = {}
            const accessToken = request.pre.accessToken
            const user = request.pre.loginUser
            const refreshToken = request.pre.refreshToken
            delete user.password
            response = {
                user: user,
                accessToken,
                refreshToken
            }
            return h.response(response).code(200)
        }
    },
    logOut: {
        pre: [],
        handler: async (request, h) => {
            try {
                const { authService } = request.server.services();
                return await authService.logOut(request)
            } catch (err) {
                errorHelper.handleError(err);
            }
        },
    },
    signUp: {
        validate: authValidator.signUp,
        pre: [
            {
                assign: 'uniqueEmail',
                method: async (request, h) => {
                    try {
                        const user = await User.findOne({ email: request.payload.email }).lean();
                        if (user) {
                            const errorObj = {};
                            errorObj.email = errors.user.emailAlreadyExist.message;
                            await errorHelper.setCustomError(errorObj);
                        }
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                    return h.continue;
                }
            },
            {
                assign: 'signup',
                method: async (request, h) => {
                    try {
                        const userPayload = request.payload
                        const user = await User.create(userPayload)
                        return user
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            }
        ],
        handler: async (request, h) => {
            return h.response(request.pre.signup).code(200)
        }
    }
}