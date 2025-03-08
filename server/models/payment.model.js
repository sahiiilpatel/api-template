'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Types = Schema.Types

const modelName = 'payment'

const dbConn = require('@plugins/mongoose.plugin').plugin.mainDbConn()

const paymentSchema = new Schema(
  {
    paymentId: {
      type: String,
      unique: true,
    },
    generatedBy: {
      type: Types.ObjectId,
    },
    entity: {
      type: String,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
    },
    status: {
      type: String,
    },
    order_id: {
      type: String,
    },
    invoice_id: {
      type: String,
    },
    international: {
      type: Boolean,
    },
    method: {
      type: String,
    },
    amount_refunded: {
      type: Number,
      default: 0,
    },
    refund_status: {
      type: String,
    },
    captured: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
    card_id: {
      type: String,
    },
    card: {
      id: {
        type: String,
      },
      entity: {
        type: String,
      },
      name: String,
      last4: {
        type: String,
      },
      network: {
        type: String,
      },
      type: {
        type: String,
      },
      issuer: String,
      international: {
        type: Boolean,
        default: false,
      },
      emi: {
        type: Boolean,
        default: false,
      },
      sub_type: {
        type: String,
      },
      token_iin: String,
    },
    bank: String,
    wallet: String,
    vpa: String,
    email: {
      type: String,
    },
    contact: String,
    notes: {
      address: String,
    },
    fee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    error_code: String,
    error_description: String,
    error_source: String,
    error_step: String,
    error_reason: String,
    acquirer_data: {
      auth_code: String,
    },
    reward: String,
  },
  {
    collection: modelName,
    timestamps: true,
    versionKey: false,
    strict: false
  }
)

exports.schema = dbConn.model(modelName, paymentSchema)
