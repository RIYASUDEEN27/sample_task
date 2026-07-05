import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axiosInstance from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('rememberMe')
  }, [])

  // Auto-login on mount if token exists
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          const res = await axiosInstance.get('/profile')
          setUser(res.data.user)
          setToken(storedToken)
        } catch {
          logout()
        }
      }
      setLoading(false)
    }
    init()
  }, [logout])

  // Listen for 401 events from axios
  useEffect(() => {
    const handleLogout = () => logout()
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [logout])

  const login = (userData, authToken, remember = false) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('token', authToken)
    if (remember) {
      localStorage.setItem('rememberMe', 'true')
    }
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
