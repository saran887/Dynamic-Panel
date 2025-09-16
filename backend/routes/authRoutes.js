
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Signup route
router.post('/signup', async (req, res) => {
	const { username, email, password } = req.body;
	try {
		// Check if user already exists
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(409).json({ message: 'Email already registered' });
		}
		const newUser = await User.create({ username, email, password });
		res.status(201).json({ message: 'Signup successful', user: { id: newUser.id, username: newUser.username, email: newUser.email } });
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
});

// Login route
router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ where: { username, password } });
		if (!user) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}
		// You can add JWT or session logic here
		res.json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
});

module.exports = router;
