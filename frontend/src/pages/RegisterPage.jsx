import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../api/axios'
import toast from 'react-hot-toast'
import {
  RiUserLine, RiMailLine, RiLockLine,
  RiEyeLine, RiEyeOffLine, RiShieldCheckLine,
  RiArrowRightLine, RiCheckLine
} from 'react-icons/ri'
import Navbar from '../components/Navbar'
import './AuthPage.css'

const passwordRules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains a letter', test: (p) => /[a-zA-Z]/.test(p) },
  { label: 'Contains a number', test: (p) => /\d/.test(p) },
]

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.username) e.username = 'Username is required'
    else if (form.username.length < 3) e.username = 'Must be at least 3 characters'
    if (!form.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters required'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const res = await axiosInstance.post('/register', form)
      login(res.data.user, res.data.token)
      toast.success(res.data.message || 'Account created! 🎉')
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setErrors(data.errors)
      } else {
        toast.error(data?.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-bg-orb auth-bg-orb--1" />
      <div className="auth-bg-orb auth-bg-orb--2" />

      <div className="auth-container auth-container--wide">
        <div className="auth-card glass-card animate-scale-in">
          {/* Header */}
          <div className="auth-card__header">
            <div className="auth-logo"><RiShieldCheckLine /></div>
            <h1 className="auth-card__title">Create your account</h1>
            <p className="auth-card__subtitle">Join DashPro — free forever, no credit card needed</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="auth-form">
            <div className="auth-form__grid">
              {/* Username */}
              <div className="form-group">
                <label className="form-label" htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <span className="input-icon"><RiUserLine /></span>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    autoComplete="username"
                    placeholder="johndoe"
                    value={form.username}
                    onChange={handleChange}
                    className={`form-input ${errors.username ? 'has-error' : ''}`}
                  />
                </div>
                {errors.username && <span className="form-error">{errors.username}</span>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email address</label>
                <div className="input-wrapper">
                  <span className="input-icon"><RiMailLine /></span>
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'has-error' : ''}`}
                  />
                </div>
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"><RiLockLine /></span>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'has-error' : ''}`}
                  />
                  <button
                    type="button"
                    className="input-action"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"><RiLockLine /></span>
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.confirmPassword ? 'has-error' : ''}`}
                  />
                  <button
                    type="button"
                    className="input-action"
                    onClick={() => setShowConfirm((p) => !p)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* Password strength */}
            {form.password && (
              <div className="password-rules animate-fade-in">
                {passwordRules.map((r) => {
                  const passed = r.test(form.password)
                  return (
                    <span key={r.label} className={`password-rule ${passed ? 'password-rule--pass' : ''}`}>
                      <RiCheckLine /> {r.label}
                    </span>
                  )
                })}
              </div>
            )}

            <button
              type="submit"
              id="register-submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
            >
              {loading ? (
                <><div className="spinner" /> Creating account...</>
              ) : (
                <>Create Account <RiArrowRightLine /></>
              )}
            </button>
          </form>

          <div className="auth-card__footer">
            <p className="auth-card__switch">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
