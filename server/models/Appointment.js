const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  doctorNote: { type: String, default: '' },
  status: { type: String, default: 'booked' }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);