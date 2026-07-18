import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext()
const API = 'http://localhost:5000/api'

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [items, setItems] = useState([])
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch all items and claims from backend
  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`${API}/items`)
      const data = await res.json()
      // normalize _id → id for frontend compatibility
      setItems(data.map(i => ({ ...i, id: i._id })))
    } catch (err) {
      console.error('fetchItems:', err)
    }
  }, [])

  const fetchClaims = useCallback(async () => {
    try {
      const res = await fetch(`${API}/claims`)
      const data = await res.json()
      setClaims(data.map(c => ({ ...c, id: c._id })))
    } catch (err) {
      console.error('fetchClaims:', err)
    }
  }, [])

  // Load data on mount
  useEffect(() => {
    fetchItems()
    fetchClaims()
  }, [fetchItems, fetchClaims])

  // Student login — store to DB
  const loginUser = async (studentData) => {
    try {
      await fetch(`${API}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      })
    } catch (err) {
      console.error('loginUser:', err)
    }
    setUser(studentData)
    setIsAdmin(false)
  }

  // Add found item
  const addItem = async (item, founderInfo = null) => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, founderInfo }),
      })
      const saved = await res.json()
      setItems(prev => [{ ...saved, id: saved._id }, ...prev])
    } catch (err) {
      console.error('addItem:', err)
    } finally {
      setLoading(false)
    }
  }

  // Delete item
  const deleteItem = async (id) => {
    try {
      await fetch(`${API}/items/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(i => i.id !== id))
      setClaims(prev => prev.filter(c => c.itemId !== id))
    } catch (err) {
      console.error('deleteItem:', err)
    }
  }

  // Submit claim
  const submitClaim = async (itemId, claimantInfo) => {
    try {
      const res = await fetch(`${API}/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, claimantInfo }),
      })
      const saved = await res.json()
      setClaims(prev => [{ ...saved, id: saved._id }, ...prev])
    } catch (err) {
      console.error('submitClaim:', err)
    }
  }

  // Approve claim
  const approveClaim = async (claimId) => {
    try {
      await fetch(`${API}/claims/${claimId}/approve`, { method: 'PATCH' })
      // Refresh both to get updated statuses
      await fetchItems()
      await fetchClaims()
    } catch (err) {
      console.error('approveClaim:', err)
    }
  }

  // Reject claim
  const rejectClaim = async (claimId) => {
    try {
      await fetch(`${API}/claims/${claimId}/reject`, { method: 'PATCH' })
      setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'rejected' } : c))
    } catch (err) {
      console.error('rejectClaim:', err)
    }
  }

  // Delete claim record
  const deleteClaim = async (claimId) => {
    try {
      await fetch(`${API}/claims/${claimId}`, { method: 'DELETE' })
      setClaims(prev => prev.filter(c => c.id !== claimId))
    } catch (err) {
      console.error('deleteClaim:', err)
    }
  }

  const userClaims = (userName, rollno) =>
    claims.filter(c => c.claimantInfo?.rollno === rollno && c.claimantInfo?.name === userName)

  const hasUserClaimed = (itemId, rollno) =>
    claims.some(c => (c.itemId === itemId || c.itemId?._id === itemId) && c.claimantInfo?.rollno === rollno)

  return (
    <AppContext.Provider value={{
      user, setUser, isAdmin, setIsAdmin,
      items, claims, loading,
      loginUser, addItem, deleteItem,
      submitClaim, approveClaim, rejectClaim, deleteClaim,
      userClaims, hasUserClaimed,
      fetchItems, fetchClaims,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
