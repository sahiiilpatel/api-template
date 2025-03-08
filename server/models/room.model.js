'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Types = Schema.Types

const modelName = 'room'

const dbConn = require('@plugins/mongoose.plugin').plugin.mainDbConn()

const roomSchema = new Schema(
  {
    roomNumber: {
      type: Number,
      required: true,
      index: true,
    },
    roomType: {
      type: String,
      enum: ["AC", "NON-AC"],
      default: null,
    },
    pgId: {
      type: Types.ObjectId,
      ref: "Pg",
      default: null,
    },
    rentAmount: {
      type: Number,
      default: null,
    },
    bedCount: {
      type: Number,
      default: 1,
    },
    createdAt: {
      type: Date,
      default: null,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
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

exports.schema = dbConn.model(modelName, roomSchema)
