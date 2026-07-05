import { Link } from 'react-router-dom'
import { RiShieldCheckLine, RiGithubLine, RiTwitterLine, RiLinkedinLine } from 'react-icons/ri'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <div className="footer__logo-icon"><RiShieldCheckLine /></div>
            <span className="footer__logo-text">Dash<span className="gradient-text">Pro</span></span>
          </div>
          <p className="footer__tagline">
            A modern, secure dashboard for the next generation of web apps.
          </p>
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="GitHub"><RiGithubLine /></a>
            <a href="#" className="footer__social-link" aria-label="Twitter"><RiTwitterLine /></a>
            <a href="#" className="footer__social-link" aria-label="LinkedIn"><RiLinkedinLine /></a>
          </div>
        </div>

        <div className="footer__links">
          <div className="footer__col">
            <h4 className="footer__col-title">Product</h4>
            <Link to="/dashboard" className="footer__link">Dashboard</Link>
            <Link to="/profile" className="footer__link">Profile</Link>
            <Link to="/register" className="footer__link">Get Started</Link>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Account</h4>
            <Link to="/login" className="footer__link">Login</Link>
            <Link to="/register" className="footer__link">Register</Link>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Stack</h4>
            <span className="footer__text">React + Vite</span>
            <span className="footer__text">Flask + PyMongo</span>
            <span className="footer__text">MongoDB Atlas</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">
          © {year} DashPro. Built with ❤️ using React & Flask.
        </p>
        <div className="footer__bottom-links">
          <a href="#" className="footer__link">Privacy</a>
          <a href="#" className="footer__link">Terms</a>
        </div>
      </div>
    </footer>
  )
}
