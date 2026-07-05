import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  RiDashboardLine,
  RiUserLine,
  RiLogoutBoxLine,
  RiMenuLine,
  RiCloseLine,
  RiShieldCheckLine,
} from 'react-icons/ri'
import './Navbar.css'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <RiShieldCheckLine />
          </div>
          <span className="navbar__logo-text">Dash<span className="gradient-text">Pro</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar__links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={`navbar__link ${isActive('/dashboard') ? 'navbar__link--active' : ''}`}>
                <RiDashboardLine /> Dashboard
              </Link>
              <Link to="/profile" className={`navbar__link ${isActive('/profile') ? 'navbar__link--active' : ''}`}>
                <RiUserLine /> Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}>Home</Link>
              <Link to="/login" className={`navbar__link ${isActive('/login') ? 'navbar__link--active' : ''}`}>Login</Link>
            </>
          )}
        </div>

        {/* Desktop Right */}
        <div className="navbar__right">
          {isAuthenticated ? (
            <div className="navbar__user" ref={dropdownRef}>
              <button
                className="navbar__avatar-btn"
                onClick={() => setDropdownOpen((p) => !p)}
                aria-label="User menu"
              >
                <div className="navbar__avatar">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="navbar__username">{user?.username}</span>
              </button>

              {dropdownOpen && (
                <div className="navbar__dropdown animate-scale-in">
                  <div className="navbar__dropdown-header">
                    <div className="navbar__avatar navbar__avatar--lg">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="navbar__dropdown-name">{user?.username}</div>
                      <div className="navbar__dropdown-email">{user?.email}</div>
                    </div>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  <Link to="/dashboard" className="navbar__dropdown-item">
                    <RiDashboardLine /> Dashboard
                  </Link>
                  <Link to="/profile" className="navbar__dropdown-item">
                    <RiUserLine /> Profile
                  </Link>
                  <div className="navbar__dropdown-divider" />
                  <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                    <RiLogoutBoxLine /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="navbar__mobile-toggle"
          onClick={() => setMobileOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <RiCloseLine /> : <RiMenuLine />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="navbar__mobile animate-fade-in">
          {isAuthenticated ? (
            <>
              <div className="navbar__mobile-user">
                <div className="navbar__avatar">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{user?.username}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{user?.email}</div>
                </div>
              </div>
              <Link to="/dashboard" className="navbar__mobile-link"><RiDashboardLine /> Dashboard</Link>
              <Link to="/profile" className="navbar__mobile-link"><RiUserLine /> Profile</Link>
              <button className="navbar__mobile-link navbar__mobile-link--danger" onClick={handleLogout}>
                <RiLogoutBoxLine /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="navbar__mobile-link">Home</Link>
              <Link to="/login" className="navbar__mobile-link">Login</Link>
              <Link to="/register" className="navbar__mobile-link">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
