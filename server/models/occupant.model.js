'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Types = Schema.Types

const modelName = 'occupant'

const dbConn = require('@plugins/mongoose.plugin').plugin.mainDbConn()

const occupantSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    password: {
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
    emergencyContactName: {
      type: String,
    },
    emergencyContactNo: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    age: {
      type: Number,
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    role: {
      type: String,
      default: "occupant",
    },
    pgId: {
      type: Types.ObjectId,
      ref: "pg",
    },
    roomId: {
      type: Types.ObjectId,
      ref: "room",
    },
    bedId: {
      type: Types.ObjectId,
      ref: "bed",
    },
    refreshToken: {
      type: String,
    },
    otp: {
      code: {
        type: String,
      },
      expiresIn: {
        type: Date,
      },
      otpType: {
        type: String,
        enum: ["passwordReset"],
      },
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loginAt: {
      type: Date,
      default: Date.now,
    },
    addedBy: {
      type: Types.ObjectId,
      default: null,
    },
    addedAt: {
      type: Date,
      default: null,
    },
    updatedAt: {
      type: Date,
      default: null,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
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

exports.schema = dbConn.model(modelName, occupantSchema)
