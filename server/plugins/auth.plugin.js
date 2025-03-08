'use strict'

const config = require('config')

exports.plugin = {
  async register(server, options) {
    const jwtValidate = async (decodedToken, request, h) => {
      try {
        const User = require('@models/user.model').schema
        const Occupant = require('@models/occupant.model').schema
        const user = await User.findById(decodedToken.user._id).select("-password -refreshToken")
        const occupant = await Occupant.findById(decodedToken.user._id).select("-password -refreshToken")

        if (!user && !occupant) {
          return { isValid: false, credentials: null }
        }

        const credentials = {}
        if (user) credentials.user = user
        if (occupant) credentials.user = occupant

        return { isValid: true, credentials }
      } catch (error) {
        console.error('JWT Validation Error:', error)
        return { isValid: false, credentials: null }
      }
    }

    server.auth.strategy('auth', 'jwt', {
      key: config.constants.JWT_SECRET,
      validate: jwtValidate,
      verifyOptions: {
        algorithms: ['HS256']
      }
    })
  },
  name: 'auth',
  version: require('../../package.json').version,
}