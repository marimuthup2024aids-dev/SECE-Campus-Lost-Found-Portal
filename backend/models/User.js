const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  rollno:  { type: String, required: true },
  dept:    { type: String, required: true },
  year:    { type: String, required: true },
  section: { type: String, required: true },
  loginAt: { type: Date, default: Date.now },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
