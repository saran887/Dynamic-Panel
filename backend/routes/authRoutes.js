const express = require('express');
const router = express.Router();
// ...existing code...
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const Logo = require('../models/logoModel');


router.post('/reset-users', async (req, res) => {
	try {
		await User.destroy({ where: {}, truncate: true });
		res.json({ message: 'Users table truncated and auto-increment reset.' });
	} catch (err) {
		res.status(500).json({ message: 'Error resetting users table', error: err.message });
	}
});

// Multer storage config for logo uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../uploads'));
	},
		filename: function (req, file, cb) {
			// Accept only jpg, png, svg
			const ext = path.extname(file.originalname).toLowerCase();
			if (!['.jpg', '.jpeg', '.png', '.svg'].includes(ext)) {
				return cb(new Error('Only jpg, jpeg, png, svg files are allowed'));
			}
			cb(null, 'logo' + ext);
		}
});
const upload = multer({ storage });

// Logo upload endpoint (user-specific)
router.post('/upload-logo', upload.single('logo'), async (req, res) => {
	const userId = req.body.userId;
	if (!req.file) {
		return res.status(400).json({ message: 'No file uploaded' });
	}
	if (!userId) {
		return res.status(400).json({ message: 'No userId provided' });
	}
	const logoPath = `/uploads/${req.file.filename}`;
	try {
		// Remove previous logo records for this user (keep only one logo per user)
		await Logo.destroy({ where: { userId } });
		// Save new logo path for user
		await Logo.create({ path: logoPath, userId });
		res.json({ message: 'Logo uploaded and path saved', logoPath });
	} catch (err) {
		res.status(500).json({ message: 'Error saving logo path', error: err.message });
	}
});

// Get current logo path for a user
router.get('/logo/:userId', async (req, res) => {
	const userId = req.params.userId;
	try {
		const logo = await Logo.findOne({ where: { userId }, order: [['createdAt', 'DESC']] });
		if (!logo) {
			return res.status(404).json({ message: 'No logo found for this user' });
		}
		res.json({ logoPath: logo.path });
	} catch (err) {
		res.status(500).json({ message: 'Error retrieving logo', error: err.message });
	}
});

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
		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await User.create({ username, email, password: hashedPassword });
		res.status(201).json({ message: 'Signup successful', user: { id: newUser.id, username: newUser.username, email: newUser.email } });
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
});

// Login route
router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ where: { username } });
		if (!user) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}
		// You can add JWT or session logic here
		res.json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
});

module.exports = router;
