const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const cleanEmail = email.toLowerCase().trim(); 

    let user = await User.findOne({ email: cleanEmail });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email: cleanEmail, password, role: role || 'patient' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' });
    res.status(201).json({ token, user: { _id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim(); 

    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' });
    res.json({ token, user: { _id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Login error' });
  }
});

module.exports = router;