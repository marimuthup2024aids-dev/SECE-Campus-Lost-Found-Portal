const router = require('express').Router()
const Item = require('../models/Item')
const Claim = require('../models/Claim')

// GET /api/items — get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/items — add new found item (admin or student)
router.post('/', async (req, res) => {
  try {
    const item = await Item.create(req.body)
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/items/:id — delete item + its claims
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id)
    await Claim.deleteMany({ itemId: req.params.id })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
