import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  RiDashboardLine,
  RiUserLine,
  RiLogoutBoxLine,
  RiShieldCheckLine,
  RiBarChartLine,
  RiSettings4Line,
} from 'react-icons/ri'
import './Sidebar.css'

const navItems = [
  { to: '/dashboard', icon: <RiDashboardLine />, label: 'Dashboard' },
  { to: '/profile', icon: <RiUserLine />, label: 'Profile' },
  { to: '/dashboard#stats', icon: <RiBarChartLine />, label: 'Statistics' },
  { to: '/profile#settings', icon: <RiSettings4Line />, label: 'Settings' },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon"><RiShieldCheckLine /></div>
        {!collapsed && <span className="sidebar__logo-text">Dash<span className="gradient-text">Pro</span></span>}
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="sidebar__user animate-fade-in">
          <div className="sidebar__user-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">{user?.username}</div>
            <div className="sidebar__user-email">{user?.email}</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar__nav">
        {!collapsed && <span className="sidebar__nav-label">Navigation</span>}
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`
            }
            end={item.to === '/dashboard'}
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar__nav-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar__nav-label-text">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar__bottom">
        <button
          className="sidebar__logout"
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
        >
          <RiLogoutBoxLine />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
