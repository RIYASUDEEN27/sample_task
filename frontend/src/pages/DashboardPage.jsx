import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import {
  RiUserLine, RiBarChartLine, RiTimeLine, RiStarLine,
  RiMenuLine, RiCloseLine, RiShieldCheckLine, RiCalendarLine,
  RiArrowRightLine, RiNotificationLine
} from 'react-icons/ri'
import './DashboardPage.css'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

const activityItems = [
  { icon: <RiShieldCheckLine />, text: 'Account created successfully', time: 'Just now', color: 'violet' },
  { icon: <RiUserLine />, text: 'Profile information updated', time: '2 min ago', color: 'teal' },
  { icon: <RiBarChartLine />, text: 'Dashboard accessed', time: '5 min ago', color: 'orange' },
  { icon: <RiStarLine />, text: 'Joined DashPro community', time: 'Today', color: 'pink' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const stats = [
    { icon: <RiUserLine />, label: 'Profile Views', value: '1,284', trend: '12%', trendUp: true, color: 'violet', delay: 0 },
    { icon: <RiBarChartLine />, label: 'Total Sessions', value: '3,491', trend: '8%', trendUp: true, color: 'teal', delay: 100 },
    { icon: <RiTimeLine />, label: 'Time Active', value: '24h', trend: '5%', trendUp: false, color: 'pink', delay: 200 },
    { icon: <RiStarLine />, label: 'Achievements', value: '7', trend: '2', trendUp: true, color: 'orange', delay: 300 },
  ]

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
      />

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="dashboard-mobile-overlay" onClick={() => setMobileSidebarOpen(false)}>
          <div className="dashboard-mobile-sidebar" onClick={(e) => e.stopPropagation()}>
            <Sidebar collapsed={false} onToggle={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="dashboard-main">
        {/* Top bar */}
        <header className="dashboard-topbar">
          <div className="dashboard-topbar__left">
            <button
              className="dashboard-topbar__toggle"
              onClick={() => setSidebarCollapsed((p) => !p)}
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? <RiMenuLine /> : <RiCloseLine />}
            </button>
            <button
              className="dashboard-topbar__mobile-toggle"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
            >
              <RiMenuLine />
            </button>
            <div>
              <h1 className="dashboard-topbar__title">Dashboard</h1>
              <p className="dashboard-topbar__subtitle">
                {getGreeting()}, {user?.username}! 👋
              </p>
            </div>
          </div>
          <div className="dashboard-topbar__right">
            <button className="dashboard-topbar__icon-btn" aria-label="Notifications">
              <RiNotificationLine />
              <span className="dashboard-topbar__badge">3</span>
            </button>
            <div className="dashboard-topbar__avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Stats Grid */}
          <section className="dashboard-section">
            <div className="dashboard-section__header">
              <h2 className="dashboard-section__title">Overview</h2>
              <span className="badge badge-success">Live</span>
            </div>
            <div className="stats-grid">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          </section>

          {/* Two-column section */}
          <div className="dashboard-two-col">
            {/* User Info Card */}
            <section className="dashboard-section">
              <div className="dashboard-section__header">
                <h2 className="dashboard-section__title">Your Profile</h2>
              </div>
              <div className="user-info-card glass-card">
                <div className="user-info-card__header">
                  <div className="user-info-card__avatar">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="user-info-card__name">{user?.username}</div>
                    <div className="user-info-card__email">{user?.email}</div>
                    <span className="badge badge-success" style={{ marginTop: 'var(--space-2)' }}>
                      ● Active
                    </span>
                  </div>
                </div>
                <div className="user-info-card__divider" />
                <div className="user-info-card__details">
                  <div className="user-info-card__row">
                    <span className="user-info-card__label"><RiUserLine /> Username</span>
                    <span className="user-info-card__value">{user?.username}</span>
                  </div>
                  <div className="user-info-card__row">
                    <span className="user-info-card__label"><RiUserLine /> Email</span>
                    <span className="user-info-card__value">{user?.email}</span>
                  </div>
                  <div className="user-info-card__row">
                    <span className="user-info-card__label"><RiCalendarLine /> Member since</span>
                    <span className="user-info-card__value">{formatDate(user?.createdAt)}</span>
                  </div>
                </div>
                <a href="/profile" className="btn btn-outline btn-full" style={{ marginTop: 'var(--space-4)' }}>
                  Edit Profile <RiArrowRightLine />
                </a>
              </div>
            </section>

            {/* Activity Feed */}
            <section className="dashboard-section">
              <div className="dashboard-section__header">
                <h2 className="dashboard-section__title">Recent Activity</h2>
              </div>
              <div className="activity-feed glass-card">
                {activityItems.map((item, i) => (
                  <div key={i} className="activity-item animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className={`activity-item__icon activity-item__icon--${item.color}`}>
                      {item.icon}
                    </div>
                    <div className="activity-item__content">
                      <div className="activity-item__text">{item.text}</div>
                      <div className="activity-item__time">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Quick Actions */}
          <section className="dashboard-section">
            <div className="dashboard-section__header">
              <h2 className="dashboard-section__title">Quick Actions</h2>
            </div>
            <div className="quick-actions">
              {[
                { icon: <RiUserLine />, label: 'Edit Profile', desc: 'Update your personal information', href: '/profile', color: 'violet' },
                { icon: <RiShieldCheckLine />, label: 'Security', desc: 'Manage password & settings', href: '/profile', color: 'teal' },
                { icon: <RiBarChartLine />, label: 'Analytics', desc: 'View detailed statistics', href: '/dashboard', color: 'pink' },
                { icon: <RiNotificationLine />, label: 'Notifications', desc: 'Manage your alerts', href: '/dashboard', color: 'orange' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="quick-action glass-card glass-card-hover"
                >
                  <div className={`quick-action__icon quick-action__icon--${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="quick-action__label">{action.label}</div>
                  <div className="quick-action__desc">{action.desc}</div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
