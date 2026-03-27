const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    user = new User({
      name,
      email,
      password,
      role: role || 'patient' 
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '2h' }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ msg: 'Registration failed', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Incorrect password' });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secretkey', 
      { expiresIn: '2h' }
    );

    res.json({ 
      token, 
      user: { _id: user._id, name: user.name, role: user.role, email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ msg: 'Login error' });
  }
});


router.put('/profile/:id', async (req, res) => {
  try {
    const { name, phone, age, gender } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { $set: { name, phone, age, gender } }, 
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ msg: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ msg: 'Update failed' });
  }
});

module.exports = router;