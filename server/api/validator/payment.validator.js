const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const checkout = {
    payload: Joi.object().keys({
        amount: Joi.any().required().label('Amount'),
        name: Joi.string().required().trim().label('Name'),
        planId: Joi.string().required().trim().label('PlanId'),
    })
}

const verification = {
    payload: Joi.object().keys({
        razorpay_payment_id: Joi.string().required().label('Razorpay payment id'),
        razorpay_order_id: Joi.string().required().label('Razorpay order id'),
        razorpay_signature: Joi.string().required().label('Razorpay signature'),
    })
}

module.exports = {
    checkout,
    verification
}