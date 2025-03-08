'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Types = Schema.Types

const modelName = 'bed'

const dbConn = require('@plugins/mongoose.plugin').plugin.mainDbConn()

const bedSchema = new Schema(
  {
    pgId: {
      type: Types.ObjectId,
      default: null,
    },
    roomId: {
      type: Types.ObjectId,
      default: null,
    },
    occupantId: {
      type: Types.ObjectId,
      default: null,
    },
    checkInDate: {
      type: Date,
      default: null,
    },
    depositAmount: {
      type: Number,
      default: null,
    },
    paidDepositAmount: {
      type: Number,
      default: null,
    },
    rentAmount: {
      type: Number,
      default: null,
    },
    paidRentAmount: {
      type: Number,
      default: null,
    },
    createdAt: {
      type: Date,
      default: null,
    },
    updatedAt: {
      type: Date,
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedBy: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },
    deletedAt: {
      type: Date,
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

exports.schema = dbConn.model(modelName, bedSchema)
