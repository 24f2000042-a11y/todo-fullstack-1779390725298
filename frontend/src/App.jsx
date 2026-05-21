import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/items`)
      setData(response.data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/api/items`, formData)
      fetchData()
      setFormData({})
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/items/${id}`)
      fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="app">
      <header className="header">
        <h1>make a todo app</h1>
        <p>Full-Stack Application</p>
      </header>
      
      <main className="main">
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Enter item..."
            value={formData.name || ''}
            onChange={(e) => setFormData({ name: e.target.value })}
          />
          <button type="submit">Add</button>
        </form>
        
        <div className="items">
          {data.map((item) => (
            <div key={item._id} className="item">
              <span>{item.name}</span>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App