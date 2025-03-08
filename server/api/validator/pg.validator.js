const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const getPgList = {
    query: Joi.object().keys({
        page: Joi.number().allow('', null).label('Page'),
        limit: Joi.number().allow('', null).label('Limit'),
        orderBy: Joi.string().allow('', null).label('Order By'), //pgName pgType
        pgType: Joi.string().allow('', null).label('Order By'), //boysOnly    girlsOnly    any
        isAsc: Joi.boolean().label('isAsc'),
        search: Joi.string().allow('', null).label('Search')
    })
}

const addNewPg = {
    payload: Joi.object().keys({
        pgName: Joi.string().required().label('Pg Name'),
        pgType: Joi.string().required().valid("boysOnly", "girlsOnly", "any").label('pgType'),
        unitCount: Joi.number().required().label('Unit Count'),
        email: Joi.string().email().required().trim().custom(value => `${value.toLowerCase()}`, 'toLowerCase').label('Email'),
        description: Joi.required().label('Description'),
        contactNo: Joi.required().label('Contact No'),
        facility: Joi.required().label('Facility'),
        termsAndConditions: Joi.required().label('Terms and Conditions'),
        addressLine1: Joi.required().label('Address Line 1'),
        addressLine2: Joi.required().label('Address Line 2'),
        city: Joi.required().label('City'),
        zipCode: Joi.required().label('zipCode')
    })
}

const deletePg = {
    params: Joi.object().keys({
        pgId: Joi.objectId().required().label('Pg Id')
    })
}

module.exports = {
    getPgList,
    addNewPg,
    deletePg
}