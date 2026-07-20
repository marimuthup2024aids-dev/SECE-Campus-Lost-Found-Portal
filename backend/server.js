require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '10mb' }))

// Routes
app.use('/api/users',  require('./routes/users'))
app.use('/api/items',  require('./routes/items'))
app.use('/api/claims', require('./routes/claims'))

// Health check
app.get('/', (req, res) => res.json({ status: 'Lost & Found API running' }))

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on http://localhost:${process.env.PORT || 5000}`)
    )
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })
