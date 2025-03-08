'use strict'

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const errorHelper = require('@utilities/error-helper')
const pgValidator = require('@validator/pg.validator')

module.exports = {
    getPgList: {
        validate: pgValidator.getPgList,
        pre: [
            {
                assign: 'getPgList',
                method: async (request, h) => {
                    try {
                        const { pgService } = request.server.services();
                        return await pgService.getPgList(request);
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            }
        ],
        handler: async (request, h) => {
            return h.response(request.pre.getPgList);
        }
    },
    addNewPg: {
        validate: pgValidator.addNewPg,
        pre: [
            {
                assign: 'addNewPg',
                method: async (request, h) => {
                    try {
                        const { pgService } = request.server.services();
                        return await pgService.addNewPg(request);
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            }
        ],
        handler: async (request, h) => {
            return h.response(request.pre.addNewPg);
        }
    },
    deletePg: {
        validate: pgValidator.deletePg,
        pre: [
            {
                assign: 'deletePg',
                method: async (request, h) => {
                    try {
                        const { pgService } = request.server.services();
                        return await pgService.deletePg(request);
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            }
        ],
        handler: async (request, h) => {
            return h.response(request.pre.deletePg);
        }
    },
    getPgNameList: {
        validate: {},
        pre: [
            {
                assign: 'getPgNameList',
                method: async (request, h) => {
                    try {
                        const { pgService } = request.server.services();
                        return await pgService.getPgNameList(request);
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            }
        ],
        handler: async (request, h) => {
            return h.response(request.pre.getPgNameList);
        }
    },
}