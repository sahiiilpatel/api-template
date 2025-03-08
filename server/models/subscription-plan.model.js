'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Types = Schema.Types

const modelName = 'subscription-plan'

const dbConn = require('@plugins/mongoose.plugin').plugin.mainDbConn()

const SubscriptionPlanSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["basic", "premium"],
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      enum: ["annually", "monthly"],
    },
    limits: {
      pgs: {
        type: Number,
        default: null,
      },
      occupants: {
        type: Number,
        default: null,
      },
    },
    features: [
      {
        type: String,
        required: true,
      },
    ],
    discount: {
      type: {
        type: String,
        enum: ["percentage", "fixed_amount"],
      },
      value: {
        type: Number,
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: modelName,
    timestamps: true,
    versionKey: false,
    strict: false
  }
)

exports.schema = dbConn.model(modelName, SubscriptionPlanSchema)
