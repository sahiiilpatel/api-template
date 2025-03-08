'use strict';

const Schmervice = require('@hapipal/schmervice')
const errorHelper = require('@utilities/error-helper')

const UserModel = require('@models/user.model').schema

module.exports = class AuthService extends Schmervice.Service {

    async logOut(request) {
        try {
            const { auth: { credentials: { user } } } = request
            await UserModel.findByIdAndUpdate(
                user._id,
                {
                    $unset: {
                        refreshToken: 1,
                    },
                },
                {
                    new: true,
                }
            );

            return { success: true, msg: 'user logged out successfully' }
        } catch (err) {
            errorHelper.handleError(err);
        }
    }
}