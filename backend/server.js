const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

const Item = mongoose.model('Item', itemSchema)

// Routes
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/items', async (req, res) => {
  try {
    const item = new Item({ name: req.body.name })
    await item.save()
    res.status(201).json(item)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id)
    res.json({ message: 'Item deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/app')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
})