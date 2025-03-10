const User = require('../models/User');

exports.getUsers = async (request, h) => {
    const users = await User.find();
    return h.response(users).code(200);
};

exports.createUser = async (request, h) => {
    const { name, email, password } = request.payload;
    const newUser = new User({ name, email, password });
    await newUser.save();
    return h.response(newUser).code(201);
};
