'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Types = Schema.Types

const modelName = 'order'

const dbConn = require('@plugins/mongoose.plugin').plugin.mainDbConn()

const orderSchema = new Schema(
  {
    name: {
      type: String,
    },
    amount: {
      type: Number,
    },
    orderId: {
      type: String,
    },
    planId: {
      type: Types.ObjectId,
      require: true,
    },
    currency: {
      type: String,
    },
    razorpay_payment_id: {
      type: String,
      default: null,
    },
    razorpay_order_id: {
      type: String,
      default: null,
    },
    razorpay_signature: {
      type: String,
      default: null,
    },
    generatedBy: {
      type: Types.ObjectId,
      required: true,
    },
  },
  {
    collection: modelName,
    timestamps: true,
    versionKey: false,
    strict: false
  }
)

exports.schema = dbConn.model(modelName, orderSchema)
