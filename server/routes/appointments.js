const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment'); 

router.get('/all', async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('userId', 'name email') 
            .sort({ date: 1 });
        
        console.log(`Fetched ${appointments.length} appointments for Doctor View`);
        
        res.json(appointments);
    } catch (err) {
        console.error("Fetch All Error:", err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/book', async (req, res) => {
    try {
        const { userId, date, time, service } = req.body;
        const newAppointment = new Appointment({ userId, date, time, service });
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.params.userId });
        res.json(appointments);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.put('/reschedule/:id', async (req, res) => {
    try {
        const updatedApp = await Appointment.findByIdAndUpdate(
            req.params.id,
            { $set: { date: req.body.date, time: req.body.time } },
            { new: true }
        );
        res.json(updatedApp);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.delete('/cancel/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Appointment cancelled' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;