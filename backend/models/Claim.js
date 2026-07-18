const mongoose = require('mongoose')

const claimSchema = new mongoose.Schema({
  itemId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  itemName:     { type: String },
  itemCategory: { type: String },
  itemPhoto:    { type: String },
  status:       { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  claimantInfo: {
    name:         { type: String, required: true },
    rollno:       { type: String, required: true },
    dept:         { type: String },
    year:         { type: String },
    phone:        { type: String },
    lostLocation: { type: String },
    lostDate:     { type: String },
    lostTime:     { type: String },
  },
  submittedAt: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Claim', claimSchema)
