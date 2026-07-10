import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [items, setItems] = useState([])
  const [claims, setClaims] = useState([]) // { id, itemId, itemName, status: 'pending'|'approved'|'rejected', claimantInfo, submittedAt }

  const addItem = (item) => {
    setItems(prev => [...prev, { ...item, id: Date.now(), returned: false }])
  }

  const deleteItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const submitClaim = (itemId, claimantInfo) => {
    const item = items.find(i => i.id === itemId)
    setClaims(prev => [...prev, {
      id: Date.now(),
      itemId,
      itemName: item?.name || '',
      itemCategory: item?.category || '',
      itemPhoto: item?.photo || null,
      status: 'pending',
      claimantInfo,
      submittedAt: new Date().toLocaleString(),
    }])
  }

  const approveClaim = (claimId) => {
    setClaims(prev => {
      const claim = prev.find(c => c.id === claimId)
      if (claim) setItems(pi => pi.map(i => i.id === claim.itemId ? { ...i, returned: true } : i))
      return prev.map(c => c.id === claimId ? { ...c, status: 'approved' } : c)
    })
  }

  const rejectClaim = (claimId) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'rejected' } : c))
  }

  const deleteClaim = (claimId) => {
    setClaims(prev => prev.filter(c => c.id !== claimId))
  }

  // claims by current user
  const userClaims = (userName, rollno) =>
    claims.filter(c => c.claimantInfo.rollno === rollno && c.claimantInfo.name === userName)

  // check if user already submitted a claim for an item
  const hasUserClaimed = (itemId, rollno) =>
    claims.some(c => c.itemId === itemId && c.claimantInfo.rollno === rollno)

  return (
    <AppContext.Provider value={{
      user, setUser, isAdmin, setIsAdmin,
      items, addItem, deleteItem,
      claims, submitClaim, approveClaim, rejectClaim, deleteClaim,
      userClaims, hasUserClaimed,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
