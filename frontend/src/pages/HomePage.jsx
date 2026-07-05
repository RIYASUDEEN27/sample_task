import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  RiShieldCheckLine, RiRocketLine, RiLockLine, RiBarChartLine,
  RiArrowRightLine, RiCheckLine
} from 'react-icons/ri'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './HomePage.css'

const features = [
  {
    icon: <RiShieldCheckLine />,
    title: 'Secure Authentication',
    desc: 'JWT-based auth with bcrypt password hashing. Your data is protected at every layer.',
    color: 'violet',
  },
  {
    icon: <RiBarChartLine />,
    title: 'Real-time Dashboard',
    desc: 'Beautiful analytics dashboard with live stats, trends, and interactive charts.',
    color: 'teal',
  },
  {
    icon: <RiLockLine />,
    title: 'Protected Routes',
    desc: 'Auto-login from localStorage with token expiry handling and smart redirects.',
    color: 'pink',
  },
  {
    icon: <RiRocketLine />,
    title: 'Production Ready',
    desc: 'Deploy to Vercel + Render + MongoDB Atlas with zero config. Full-stack in minutes.',
    color: 'orange',
  },
]

const perks = [
  'React + Vite Frontend',
  'Python Flask REST API',
  'MongoDB Atlas Database',
  'JWT Authentication',
  'Responsive Design',
  'One-click Deploy',
]

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="home">
        {/* Hero */}
        <section className="hero">
          <div className="hero__bg-orb hero__bg-orb--1" />
          <div className="hero__bg-orb hero__bg-orb--2" />
          <div className="hero__bg-orb hero__bg-orb--3" />
          <div className="hero__content">
            <div className="badge badge-info animate-fade-in" style={{ marginBottom: 'var(--space-6)' }}>
              🚀 Full Stack Dashboard App
            </div>
            <h1 className="hero__title animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              The Modern Dashboard<br />
              <span className="gradient-text">Built for Developers</span>
            </h1>
            <p className="hero__subtitle animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              A production-ready full-stack application with React, Flask, MongoDB Atlas,
              JWT authentication, and a stunning modern UI — ready to customize and deploy.
            </p>
            <div className="hero__cta animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Open Dashboard <RiArrowRightLine />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Get Started Free <RiArrowRightLine />
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-lg">
                    Sign In
                  </Link>
                </>
              )}
            </div>
            {/* Perks */}
            <div className="hero__perks animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              {perks.map((p) => (
                <span key={p} className="hero__perk">
                  <RiCheckLine /> {p}
                </span>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="hero__visual animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="hero__dashboard-preview">
              <div className="preview__header">
                <div className="preview__dot preview__dot--red" />
                <div className="preview__dot preview__dot--yellow" />
                <div className="preview__dot preview__dot--green" />
                <span className="preview__title">DashPro Dashboard</span>
              </div>
              <div className="preview__body">
                <div className="preview__stat-row">
                  {[
                    { label: 'Users', val: '2,847', color: 'violet' },
                    { label: 'Revenue', val: '$12.4K', color: 'teal' },
                    { label: 'Sessions', val: '18.2K', color: 'pink' },
                  ].map((s) => (
                    <div key={s.label} className={`preview__stat preview__stat--${s.color}`}>
                      <div className="preview__stat-val">{s.val}</div>
                      <div className="preview__stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="preview__bars">
                  {[80, 55, 90, 40, 70, 85, 60].map((h, i) => (
                    <div key={i} className="preview__bar-wrap">
                      <div className="preview__bar" style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
                <div className="preview__bottom">
                  <div className="preview__user-row">
                    <div className="preview__avatar">J</div>
                    <div>
                      <div className="preview__user-name">John Doe</div>
                      <div className="preview__user-role">Administrator</div>
                    </div>
                    <div className="preview__badge-active">Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features">
          <div className="features__inner">
            <div className="section-header">
              <h2 className="section-title">Everything You Need</h2>
              <p className="section-subtitle">
                A complete full-stack template with authentication, protected routes, profile management, and more.
              </p>
            </div>
            <div className="features__grid">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className={`feature-card glass-card glass-card-hover animate-fade-in-up`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`feature-card__icon feature-card__icon--${f.color}`}>{f.icon}</div>
                  <h3 className="feature-card__title">{f.title}</h3>
                  <p className="feature-card__desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="cta-banner">
          <div className="cta-banner__inner">
            <h2 className="cta-banner__title">Ready to get started?</h2>
            <p className="cta-banner__subtitle">Create your account in seconds — no credit card required.</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account <RiArrowRightLine />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
