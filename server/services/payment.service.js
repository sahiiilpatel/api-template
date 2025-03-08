'use strict'

const Joi = require('joi')
const Boom = require('@hapi/boom')
const Razorpay = require('razorpay')
const Crypto = require('crypto')
Joi.objectId = require('joi-objectid')(Joi)
const ObjectId = require('mongodb').ObjectId
const Schmervice = require('@hapipal/schmervice')
const errorHelper = require('@utilities/error-helper')

const orderModel = require('@models/order.model').schema
const paymentModel = require('@models/payment.model').schema
const userModel = require('@models/user.model').schema

const razorpay = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

module.exports = class PaymentService extends Schmervice.Service {

  async checkout(request) {
    try {
      const { payload: { amount, name, planId }, auth: { credentials: { user } } } = request

      const order = await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
      });

      await orderModel.create({
        amount: amount,
        currency: order.currency,
        amount_paid: 0,
        amount_due: amount,
        orderId: order.id,
        generatedBy: new ObjectId(user._id),
        planId: planId,
        name: name,
      });

      return { message: "order created", data: order }
    } catch (err) {
      errorHelper.handleError(err);
    }
  }

  async verification(request) {
    try {
      const { payload: { razorpay_payment_id, razorpay_order_id, razorpay_signature } } = request

      const body_data = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = Crypto.createHmac("sha256", process.env.key_secret).update(body_data).digest("hex");
      const isValid = expectedSignature === razorpay_signature;

      if (isValid) {
        await orderModel.findOneAndUpdate(
          { orderId: razorpay_order_id },
          {
            razorpay_payment_id: razorpay_payment_id,
            razorpay_order_id: razorpay_order_id,
            razorpay_signature: razorpay_signature
          },
          { new: true }
        )
        return { success: true, message: "verification completed successfully" }
      } else {
        return { success: false, message: "verification field" }
      }
    } catch (err) {
      errorHelper.handleError(err);
    }
  }

  async webhook(request) {
    try {
      const { payload: { payload: { payment } } } = request

      if (!payment) errorHelper.handleError(Boom.badRequest("payment data not found"))

      const orderData = await orderModel.findOne({ orderId: payment.entity.order_id })
      if (!orderData) errorHelper.handleError(Boom.badRequest("order not found"))

      let payload = {
        ...payment.entity,
        paymentId: payment.entity.id,
        generatedBy: new ObjectId(orderData.generatedBy),
      }

      const paymentDataExists = await paymentModel.findOne({ paymentId: payload.paymentId })
      if (paymentDataExists) {
        await paymentModel.findOneAndUpdate({ paymentId: payload.paymentId }, payload, { new: true })
        if (payment?.status !== "captured") {
          const currentDate = new Date();
          const endDate = new Date();
          endDate.setFullYear(currentDate.getFullYear() + 1);
          await userModel.findByIdAndUpdate(orderData.generatedBy, {
            $set: {
              subscription: {
                isActive: true,
                planId: orderData.planId,
                startAt: currentDate,
                endAt: endDate,
              }
            }
          })
        }
        return { success: true, message: "payment updated successfully" }
      }

      const PaymentData = await paymentModel.create(payload)
      if (!PaymentData) errorHelper.handleError(Boom.badRequest("Payment Not created...."))

      return { success: false, message: "Payment added successfully...." }
    } catch (err) {
      errorHelper.handleError(err);
    }
  }
}
