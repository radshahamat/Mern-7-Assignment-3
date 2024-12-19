const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { firstName, lastName, NIDNumber, phoneNumber, password, bloodGroup } = req.body;

    const userExists = await User.findOne({ NIDNumber });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ firstName, lastName, NIDNumber, phoneNumber, password, bloodGroup });
    res.status(201).json({ message: 'User registered successfully' });
};

const loginUser = async (req, res) => {
    const { NIDNumber, password } = req.body;

    const user = await User.findOne({ NIDNumber });
    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user.id);
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

const getProfile = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) res.status(200).json(user);
    else res.status(404).json({ message: 'User not found' });
};

const getAllProfiles = async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
};

const updateProfile = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        Object.assign(user, req.body);
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) res.status(200).json({ message: 'User deleted successfully' });
    else res.status(404).json({ message: 'User not found' });
};

module.exports = { registerUser, loginUser, getProfile, getAllProfiles, updateProfile, deleteUser };
