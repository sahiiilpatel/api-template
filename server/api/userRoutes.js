const userController = require('../services/userService');
const userValidator = require('../api/validator/userValidator');

module.exports = [
    {
        method: 'GET',
        path: '/users',
        handler: userController.getUsers
    },
    {
        method: 'POST',
        path: '/users',
        handler: userController.createUser,
        options: {
            validate: {
                payload: userValidator.createUserSchema
            }
        }
    }
];
