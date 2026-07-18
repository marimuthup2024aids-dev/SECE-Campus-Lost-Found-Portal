const router = require('express').Router()
const User = require('../models/User')

// POST /api/users/login — store login session to DB
router.post('/login', async (req, res) => {
  try {
    const { name, rollno, dept, year, section } = req.body
    if (!name || !rollno || !dept || !year || !section)
      return res.status(400).json({ error: 'All fields required' })

    const user = await User.create({ name, rollno, dept, year, section, loginAt: new Date() })
    res.status(201).json({ success: true, user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/users — get all login records (admin)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
