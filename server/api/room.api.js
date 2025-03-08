'use strict'

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const errorHelper = require('@utilities/error-helper')
const roomValidator = require('@validator/room.validator')

module.exports = {
    getRoomList: {
        validate: roomValidator.getRoomList,
        pre: [
            {
                assign: 'getRoomList',
                method: async (request, h) => {
                    try {
                        const { roomService } = request.server.services();
                        return await roomService.getRoomList(request);
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            }
        ],
        handler: async (request, h) => {
            return h.response(request.pre.getRoomList);
        }
    },
    addRoom: {
        validate: roomValidator.addRoom,
        pre: [
            {
                assign: 'addRoom',
                method: async (request, h) => {
                    try {
                        const { roomService } = request.server.services();
                        return await roomService.addRoom(request);
                    } catch (err) {
                        errorHelper.handleError(err);
                    }
                }
            }
        ],
        handler: async (request, h) => {
            return h.response(request.pre.addRoom);
        }
    }
}