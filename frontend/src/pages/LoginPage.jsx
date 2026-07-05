import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../api/axios'
import toast from 'react-hot-toast'
import {
  RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine,
  RiShieldCheckLine, RiArrowRightLine, RiLoaderLine
} from 'react-icons/ri'
import Navbar from '../components/Navbar'
import './AuthPage.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const res = await axiosInstance.post('/login', {
        email: form.email,
        password: form.password,
      })
      login(res.data.user, res.data.token, form.remember)
      toast.success(res.data.message || 'Welcome back! 👋')
      navigate(from, { replace: true })
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setErrors(data.errors)
      } else {
        toast.error(data?.message || 'Login failed. Please try again.')
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

      <div className="auth-container">
        <div className="auth-card glass-card animate-scale-in">
          {/* Header */}
          <div className="auth-card__header">
            <div className="auth-logo">
              <RiShieldCheckLine />
            </div>
            <h1 className="auth-card__title">Welcome back</h1>
            <p className="auth-card__subtitle">Sign in to your DashPro account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="auth-form">
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <span className="input-icon"><RiMailLine /></span>
                <input
                  id="email"
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
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><RiLockLine /></span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
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

            {/* Remember + Forgot */}
            <div className="auth-form__row">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  id="remember"
                />
                <span className="auth-checkbox__box" />
                <span className="auth-checkbox__label">Remember me</span>
              </label>
              <button type="button" className="auth-link auth-link--subtle">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
            >
              {loading ? (
                <><div className="spinner" /> Signing in...</>
              ) : (
                <>Sign In <RiArrowRightLine /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-card__footer">
            <p className="auth-card__switch">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
