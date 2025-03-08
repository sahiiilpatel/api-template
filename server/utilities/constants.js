'use strict'

const errors = {
    general: {
        defaultSettingNotFound: {
            status: 400,
            code: 'setting_not_found',
            message: 'default settings not found'
        },
        contactSupport: {
            status: 400,
            code: 'contact_support',
            message: 'contact support'
        },
        invalidRequest: {
            status: 400,
            code: 'invalid_request',
            message: 'invalid request parameters'
        },
        emailNotFound: {
            status: 404,
            code: 'email_not_found',
            message: 'email not found'
        }
    },
    authorization: {
        unauthorized: {
            status: 401,
            code: 'unauthorized',
            message: 'trying to access unauthorized resource'
        },
        invalidCredentials: {
            status: 401,
            code: 'invalid_credentials',
            message: 'invalid credentials'
        }
    },

    user: {
        invalidCredentials: {
            status: 401,
            code: 'invalid_credentials',
            message: 'wrong username or password'
        },
        deleted: {
            status: 400,
            code: 'user_deleted',
            message: 'user is deleted'
        },
        verificationPending: {
            status: 401,
            code: 'email_verification_pending',
            message: 'email verification pending'
        },
        emailAlreadyExist: {
            status: 400,
            code: 'email_exist',
            message: 'Email address already exists'
        },
        phoneAlreadyExist: {
            status: 400,
            code: 'phone_exist',
            message: 'phone number already exists'
        },
        wrongPassword: {
            status: 400,
            code: 'invalid_credentials',
            message: 'Password is incorrect.'
        },
        newPasswordWrong: {
            status: 400,
            code: 'invalid_credentials',
            message: 'new password should not same as old'
        },
        wrongEmail: {
            status: 400,
            code: 'invalid_credentials',
            message: 'We couldn’t find an account with this email.'
        },
        wrongMobile: {
            status: 400,
            code: 'invalid_credentials',
            message: 'Wrong mobile number'
        },
        otp: {
            status: 400,
            code: 'invalid_credentials',
            message: 'Wrong Otp'
        },
        oldPasswordWrong: {
            status: 400,
            code: 'invalid_credentials',
            message: 'Old Password not match'
        },
        emailNotFound: {
            status: 400,
            code: 'email_not_found',
            message: "We can't find your email."
        }
    },

    session: {
        notFound: {
            status: 404,
            code: 'session_not_found',
            message: 'session is not found'
        },
        notDeletable: {
            status: 400,
            code: 'session_not_deletable',
            message: 'session not deletable'
        },
        expired: {
            status: 401,
            code: 'session_expired',
            message: 'session is already expired'
        }
    }
}

module.exports = {
    errors
}