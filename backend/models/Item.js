const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, required: true },
  location:    { type: String, required: true },
  date:        { type: String, required: true },
  time:        { type: String },
  description: { type: String, required: true },
  notes:       { type: String },
  photo:       { type: String },
  returned:    { type: Boolean, default: false },
  approvedClaimantName:   { type: String },
  approvedClaimantRollno: { type: String },
  founderInfo: {
    name:          { type: String },
    rollno:        { type: String },
    dept:          { type: String },
    year:          { type: String },
    phone:         { type: String },
    foundLocation: { type: String },
    foundDate:     { type: String },
    foundTime:     { type: String },
  },
}, { timestamps: true })

module.exports = mongoose.model('Item', itemSchema)
