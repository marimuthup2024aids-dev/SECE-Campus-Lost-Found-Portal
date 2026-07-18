const router = require('express').Router()
const Claim = require('../models/Claim')
const Item = require('../models/Item')

// GET /api/claims — all claims (admin)
router.get('/', async (req, res) => {
  try {
    const claims = await Claim.find().sort({ createdAt: -1 })
    res.json(claims)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/claims — submit a claim
router.post('/', async (req, res) => {
  try {
    const { itemId, claimantInfo } = req.body
    const item = await Item.findById(itemId)
    if (!item) return res.status(404).json({ error: 'Item not found' })

    const claim = await Claim.create({
      itemId,
      itemName: item.name,
      itemCategory: item.category,
      itemPhoto: item.photo,
      claimantInfo,
      submittedAt: new Date().toLocaleString(),
    })
    res.status(201).json(claim)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/claims/:id/approve — approve claim, reject all others for same item
router.patch('/:id/approve', async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
    if (!claim) return res.status(404).json({ error: 'Claim not found' })

    // Mark item as returned with approved claimant info
    await Item.findByIdAndUpdate(claim.itemId, {
      returned: true,
      approvedClaimantName: claim.claimantInfo.name,
      approvedClaimantRollno: claim.claimantInfo.rollno,
    })

    // Approve this claim
    claim.status = 'approved'
    await claim.save()

    // Auto-reject all other pending claims for same item
    await Claim.updateMany(
      { itemId: claim.itemId, _id: { $ne: claim._id }, status: 'pending' },
      { status: 'rejected' }
    )

    res.json({ success: true, claim })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/claims/:id/reject — reject a claim
router.patch('/:id/reject', async (req, res) => {
  try {
    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    )
    res.json(claim)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/claims/:id — delete a claim record
router.delete('/:id', async (req, res) => {
  try {
    await Claim.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
