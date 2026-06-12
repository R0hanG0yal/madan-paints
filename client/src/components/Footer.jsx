import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-section">
          <h4>About</h4>
          <Link to="/">Contact Us</Link>
          <Link to="/">About Us</Link>
          <Link to="/">Careers</Link>
          <Link to="/">Press</Link>
        </div>
        <div className="footer-section">
          <h4>Help</h4>
          <Link to="/">Payments</Link>
          <Link to="/">Shipping</Link>
          <Link to="/">Returns</Link>
          <Link to="/">FAQ</Link>
        </div>
        <div className="footer-section">
          <h4>Policy</h4>
          <Link to="/">Return Policy</Link>
          <Link to="/">Terms of Use</Link>
          <Link to="/">Security</Link>
          <Link to="/">Privacy</Link>
        </div>
        <div className="footer-section">
          <h4>Social</h4>
          <Link to="/">Facebook</Link>
          <Link to="/">Twitter</Link>
          <Link to="/">YouTube</Link>
          <Link to="/">Instagram</Link>
        </div>
        <div className="footer-section contact-info">
          <h4>Mail Us</h4>
          <p>Madan Paints,<br/>Kath Mandi, Near SBI Bank,<br/>Charkhi Dadri - 127306,<br/>Haryana, India</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2024 Madan Paints. All rights reserved.</span>
        <div className="payment-methods">
          <span>Payments:</span>
          <span className="payment-icon">Visa</span>
          <span className="payment-icon">MC</span>
          <span className="payment-icon">UPI</span>
          <span className="payment-icon">Net</span>
        </div>
      </div>
    </footer>
  );
}
