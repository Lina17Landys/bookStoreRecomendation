import React, { useEffect, useState } from 'react';
import Landing from '../../components/Landing/Landing';
import Barra from '../../components/barra/barra';
import Features from '../../components/features/features';
import BooksFamosos from '../../components/booksFamosos/booksfamosos';
import PasosGuia from '../../components/pasosGuia/pasosGuia';
import Footer from '../../components/footer/footer';
import BookLoader from '../../components/BookLoader/BookLoader';
import "./LandingPage.css";

const LandingPage = () => {
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => setCargando(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (cargando) {
    return (
      <div className="landing-loader">
        <BookLoader />
      </div>
    );
  }

  return (
    <div>
      <Barra />
      <Landing />
      <Features />
      <BooksFamosos />

      <div className='section-landing'>
        <hr className="divider" />
        <p className="quote-final">
          <strong>No más libros que abandonas en la página 10. </strong>
          Entra, responde y recibe tu siguiente lectura.
        </p>
      </div>

      <PasosGuia />
      <Footer />
    </div>
  );
};

export default LandingPage;
