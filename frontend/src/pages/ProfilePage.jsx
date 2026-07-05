import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../api/axios'
import toast from 'react-hot-toast'
import {
  RiUserLine, RiMailLine, RiCalendarLine, RiEditLine,
  RiSaveLine, RiCloseLine, RiShieldCheckLine, RiArrowLeftLine
} from 'react-icons/ri'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import './ProfilePage.css'

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ username: '', email: '' })
  const [errors, setErrors] = useState({})
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({ username: user.username || '', email: user.email || '' })
    }
  }, [user])

  const validate = () => {
    const e = {}
    if (!form.username) e.username = 'Username is required'
    else if (form.username.length < 3) e.username = 'Must be at least 3 characters'
    if (!form.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const res = await axiosInstance.put('/profile', form)
      updateUser(res.data.user)
      toast.success(res.data.message || 'Profile updated! ✅')
      setEditing(false)
      setErrors({})
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setErrors(data.errors)
      } else {
        toast.error(data?.message || 'Update failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setErrors({})
    if (user) setForm({ username: user.username || '', email: user.email || '' })
  }

  return (
    <div className="dashboard-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
      />

      <div className="dashboard-main">
        {/* Top bar */}
        <header className="dashboard-topbar">
          <div className="dashboard-topbar__left">
            <button
              className="dashboard-topbar__toggle"
              onClick={() => setSidebarCollapsed((p) => !p)}
              aria-label="Toggle sidebar"
            >
              <RiUserLine />
            </button>
            <div>
              <h1 className="dashboard-topbar__title">Profile</h1>
              <p className="dashboard-topbar__subtitle">Manage your account information</p>
            </div>
          </div>
          <div className="dashboard-topbar__right">
            <Link to="/dashboard" className="btn btn-ghost btn-sm">
              <RiArrowLeftLine /> Dashboard
            </Link>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="profile-layout">
            {/* Left: Avatar Card */}
            <div className="profile-sidebar-card">
              <div className="profile-avatar-card glass-card animate-fade-in">
                <div className="profile-avatar-card__avatar">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h2 className="profile-avatar-card__name">{user?.username}</h2>
                <p className="profile-avatar-card__email">{user?.email}</p>
                <span className="badge badge-success" style={{ marginTop: 'var(--space-3)' }}>
                  ● Verified Account
                </span>

                <div className="profile-avatar-card__stats">
                  <div className="profile-avatar-card__stat">
                    <span className="profile-avatar-card__stat-val">1</span>
                    <span className="profile-avatar-card__stat-label">Account</span>
                  </div>
                  <div className="profile-avatar-card__stat-div" />
                  <div className="profile-avatar-card__stat">
                    <span className="profile-avatar-card__stat-val">7</span>
                    <span className="profile-avatar-card__stat-label">Achievements</span>
                  </div>
                  <div className="profile-avatar-card__stat-div" />
                  <div className="profile-avatar-card__stat">
                    <span className="profile-avatar-card__stat-val">∞</span>
                    <span className="profile-avatar-card__stat-label">Potential</span>
                  </div>
                </div>
              </div>

              {/* Account Security Card */}
              <div className="profile-security-card glass-card animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="profile-security-card__header">
                  <RiShieldCheckLine />
                  <span>Account Security</span>
                </div>
                <div className="profile-security-item">
                  <span className="profile-security-item__label">Password</span>
                  <span className="badge badge-success">Protected</span>
                </div>
                <div className="profile-security-item">
                  <span className="profile-security-item__label">JWT Token</span>
                  <span className="badge badge-success">Active</span>
                </div>
                <div className="profile-security-item">
                  <span className="profile-security-item__label">Email Verified</span>
                  <span className="badge badge-info">Pending</span>
                </div>
              </div>
            </div>

            {/* Right: Edit Form */}
            <div className="profile-main-card">
              <div className="profile-form-card glass-card animate-scale-in">
                <div className="profile-form-card__header">
                  <div>
                    <h3 className="profile-form-card__title">Personal Information</h3>
                    <p className="profile-form-card__subtitle">Update your account details below</p>
                  </div>
                  {!editing && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setEditing(true)}
                      id="edit-profile-btn"
                    >
                      <RiEditLine /> Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSave} noValidate>
                  <div className="profile-form-grid">
                    {/* Username */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="profile-username">Username</label>
                      {editing ? (
                        <>
                          <div className="input-wrapper">
                            <span className="input-icon"><RiUserLine /></span>
                            <input
                              id="profile-username"
                              type="text"
                              name="username"
                              value={form.username}
                              onChange={handleChange}
                              className={`form-input ${errors.username ? 'has-error' : ''}`}
                              placeholder="Your username"
                            />
                          </div>
                          {errors.username && <span className="form-error">{errors.username}</span>}
                        </>
                      ) : (
                        <div className="profile-field-display">
                          <RiUserLine />
                          <span>{user?.username}</span>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="profile-email">Email Address</label>
                      {editing ? (
                        <>
                          <div className="input-wrapper">
                            <span className="input-icon"><RiMailLine /></span>
                            <input
                              id="profile-email"
                              type="email"
                              name="email"
                              value={form.email}
                              onChange={handleChange}
                              className={`form-input ${errors.email ? 'has-error' : ''}`}
                              placeholder="your@email.com"
                            />
                          </div>
                          {errors.email && <span className="form-error">{errors.email}</span>}
                        </>
                      ) : (
                        <div className="profile-field-display">
                          <RiMailLine />
                          <span>{user?.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Member Since (read-only) */}
                    <div className="form-group">
                      <label className="form-label">Member Since</label>
                      <div className="profile-field-display">
                        <RiCalendarLine />
                        <span>{formatDate(user?.createdAt)}</span>
                      </div>
                    </div>

                    {/* Account ID (read-only) */}
                    <div className="form-group">
                      <label className="form-label">Account ID</label>
                      <div className="profile-field-display profile-field-display--mono">
                        <RiShieldCheckLine />
                        <span>{user?.id || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Editing actions */}
                  {editing && (
                    <div className="profile-form-actions animate-fade-in">
                      <button
                        type="submit"
                        id="save-profile-btn"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <><div className="spinner" /> Saving...</>
                        ) : (
                          <><RiSaveLine /> Save Changes</>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        <RiCloseLine /> Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Danger Zone */}
              <div className="danger-zone glass-card animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <div className="danger-zone__header">
                  <h3 className="danger-zone__title">Danger Zone</h3>
                  <p className="danger-zone__subtitle">Irreversible actions for your account</p>
                </div>
                <div className="danger-zone__actions">
                  <div className="danger-zone__action">
                    <div>
                      <div className="danger-zone__action-label">Delete Account</div>
                      <div className="danger-zone__action-desc">Permanently delete your account and all data</div>
                    </div>
                    <button className="btn btn-danger btn-sm" disabled>Delete Account</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
