import { Link } from 'react-router-dom'
import { RiHome4Line, RiArrowLeftLine, RiDashboardLine } from 'react-icons/ri'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="not-found">
        <div className="not-found__bg-orb not-found__bg-orb--1" />
        <div className="not-found__bg-orb not-found__bg-orb--2" />
        <div className="not-found__content animate-fade-in-up">
          <div className="not-found__code">404</div>
          <div className="not-found__badge">
            Page not found
          </div>
          <h1 className="not-found__title">
            Oops! You've ventured into<br />
            <span className="gradient-text">uncharted territory</span>
          </h1>
          <p className="not-found__subtitle">
            The page you're looking for doesn't exist, has been moved,
            or is temporarily unavailable.
          </p>
          <div className="not-found__actions">
            <Link to="/" className="btn btn-primary btn-lg">
              <RiHome4Line /> Go Home
            </Link>
            <Link to="/dashboard" className="btn btn-outline btn-lg">
              <RiDashboardLine /> Dashboard
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
