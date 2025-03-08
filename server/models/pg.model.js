'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Types = Schema.Types

const modelName = 'pg'

const dbConn = require('@plugins/mongoose.plugin').plugin.mainDbConn()

const AddressSchema = new Schema(
  {
    addressLine1: {
      type: String,
      default: null,
    },
    addressLine2: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    zipCode: {
      type: String,
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
  },
  {
    _id: true,
    timestamps: true,
  }
);

const pgSchema = new Schema(
  {
    pgName: {
      type: String,
      default: null,
    },
    pgType: {
      type: String,
      enum: ["girlsOnly", "boysOnly", "any"],
      default: null,
    },
    address: {
      type: AddressSchema,
      default: {},
    },
    contactNo: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    facility: {
      type: String,
    },
    termsAndConditions: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    unitCount: {
      type: Number,
      default: null,
    },
    imageName: {
      type: String,
      default: null,
    },
    imagePath: {
      type: String,
      default: null,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
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

exports.schema = dbConn.model(modelName, pgSchema)
