import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>Servicios</h3>
          <ul>
            <li><a href="https://t.me/tu_bot" target="_blank" rel="noopener noreferrer">Telegram</a></li>
            <li><a href="mailto:contacto@tusitio.com">Contacto</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Nosotros</h3>
          <ul>
            <li><a href="/quienes-somos">Quiénes somos</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Legal</h3>
          <ul>
            <li><a href="/terminos">Términos y condiciones</a></li>
            <li><a href="/privacidad">Política de privacidad</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

