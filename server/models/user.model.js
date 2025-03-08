'use strict'

const mongoose = require('mongoose')

const { v4: Uuidv4 } = require('uuid')

const Bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema

const Types = Schema.Types

const modelName = 'user'

const dbConn = require('@plugins/mongoose.plugin').plugin.mainDbConn()

const userSchema = new Schema(
  {
    firstName: {
      type: Types.String,
      required: true,
    },
    lastName: {
      type: Types.String,
      required: true,
    },
    password: {
      type: Types.String,
      required: true,
    },
    email: {
      type: Types.String,
      required: true,
      unique: true,
      index: true,
    },
    phoneNumber: {
      type: Types.String,
      default: null
    },
    role: {
      type: Types.String,
      enum: ["superadmin", "pgowner", "user"],
    },
    avatar: {
      type: Types.String,
      default: null
    },
    coverImage: {
      type: Types.String,
      default: null
    },
    address: {
      street: {
        type: Types.String,
        default: null
      },
      city: {
        type: Types.String,
        default: null
      },
      state: {
        type: Types.String,
        default: null
      },
      zipCode: {
        type: Types.String,
        default: null
      },
      country: {
        type: Types.String,
        default: null
      },
    },
    bio: {
      type: Types.String,
      default: null
    },
    addedBy: {
      type: Types.ObjectId,
      ref: "PgOwner",
    },
    lastLogin: {
      type: Types.Date,
      default: null,
    },
    loginAt: {
      type: Types.Date,
      default: null,
    },
    isActive: {
      type: Types.Boolean,
      default: true,
    },
    isAdmin: {
      type: Types.Boolean,
      required: true,
      default: false,
    },
    refreshToken: {
      type: Types.String,
    },
    impersonateKey: {
      type: Types.String,
      default: null,
    },
    subscription: {
      isActive: {
        type: Types.Boolean,
        required: true,
        default: false,
      },
      planId: {
        type: Types.ObjectId,
        ref: "plan",
        default: null,
      },
      startAt: {
        type: Types.Date,
        default: null,
      },
      endAt: {
        type: Types.Date,
        default: null,
      },
    },
    otp: {
      code: {
        type: Types.Number,
        default: null,
      },
      expiredAt: {
        type: Types.Date,
        default: null,
      },
      otpType: {
        type: Types.String,
        default: null,
      },
    },
  },
  {
    collection: modelName,
    timestamps: true,
    versionKey: false,
    strict: false
  }
)

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isNew) {
    // Set Password & hash before save it
    if (user.password) {
      const passHash = await user.generateHash(user.password)
      user.password = passHash.hash
    }
    const emailHash = await user.generateHash()
    user.emailHash = emailHash.hash
    user.wasNew = true
  }
  next()
})

userSchema.methods = {
  generateHash: async function (key) {
    try {
      if (key === undefined) {
        key = Uuidv4()
      }
      const salt = await Bcrypt.genSalt(10)
      const hash = await Bcrypt.hash(key, salt)
      return {
        key,
        hash
      }
    } catch (err) {
      errorHelper.handleError(err)
    }
  }
}

userSchema.methods = {
  generateRefreshToken: async function (key) {
    try {
      const token = jwt.sign(
        {
          _id: this._id,
        },
        process.env.REFRESH_TOKEN,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
      )
      return token
    } catch (err) {
      errorHelper.handleError(err)
    }
  }
}

userSchema.statics = {
  generateHash: async function (key) {
    try {
      if (key === undefined) {
        key = Uuidv4()
      }
      const salt = await Bcrypt.genSalt(10)
      const hash = await Bcrypt.hash(key, salt)
      return {
        key,
        hash
      }
    } catch (err) {
      errorHelper.handleError(err)
    }
  }
}

exports.schema = dbConn.model(modelName, userSchema)