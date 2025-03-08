'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Types = Schema.Types

const modelName = 'otp'

const dbConn = require('@plugins/mongoose.plugin').plugin.mainDbConn()

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    expiredAt: {
      type: Date,
      default: null,
      required: true,
    },
    expired: {
      type: Boolean,
      default: false,
    },
    otpType: {
      type: String,
      enum: ["login", "register"],
      default: null,
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

exports.schema = dbConn.model(modelName, otpSchema)
