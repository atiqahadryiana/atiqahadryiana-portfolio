import { Link } from 'react-router-dom';
import { profile } from '../data/portfolio';
export default function Footer() {
  const name = profile.name === 'YOUR_NAME' ? profile.wordmark : profile.name;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {name}
          </span>
          <span>Made with care, curiosity & a little purple.</span>
          <Link to="/#home">Back to top ↑</Link>
        </div>
      </div>
    </footer>
  );
}
