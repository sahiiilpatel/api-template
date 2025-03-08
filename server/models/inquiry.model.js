'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Types = Schema.Types

const modelName = 'inquiry'

const dbConn = require('@plugins/mongoose.plugin').plugin.mainDbConn()

const inquirySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pgName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    phoneNumber: {
      type: String,
    },
    pgType: {
      type: String,
      enum: ["girlsOnly", "boysOnly", "any"],
      default: null,
    },
    unitCount: {
      type: Number,
      default: null,
    },
  },
  {
    collection: modelName,
    timestamps: true,
    versionKey: false,
    strict: false
  }
)

exports.schema = dbConn.model(modelName, inquirySchema)
