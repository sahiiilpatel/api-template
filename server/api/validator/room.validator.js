const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const getRoomList = {
    query: Joi.object().keys({
        page: Joi.number().allow('', null).label('Page'),
        limit: Joi.number().allow('', null).label('Limit'),
        orderBy: Joi.string().allow('', null).label('Order By'), //pgName pgType
        roomType: Joi.string().allow('', null).label('Order By'), //boysOnly    girlsOnly    any
        isAsc: Joi.boolean().label('isAsc'),
        search: Joi.string().allow('', null).label('Search')
    })
}

const addRoom = {
    payload: Joi.object().keys({
        pgId: Joi.objectId().required().label('pg ID'),
        bedCount: Joi.string().required().label('Bed Count'),
        depositAmount: Joi.string().required().label('Deposit Amount'),
        rentAmount: Joi.string().required().label('Rent Amount'),
        roomNumber: Joi.string().required().label('Room Number'),
        roomType: Joi.string().required().label('Room Type')
    })
}

module.exports = {
    getRoomList,
    addRoom
}