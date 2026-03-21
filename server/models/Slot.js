const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  isBooked: { 
    type: Boolean, 
    default: false 
  }
});

module.exports = mongoose.model('Slot', SlotSchema);