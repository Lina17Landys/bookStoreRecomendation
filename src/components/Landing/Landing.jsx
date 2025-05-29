import React from 'react';
import './Landing.css';

const Landing = () => {
  return (
    <div id="landing-container">
      <h1 id="landing-title">
        ¿No sabes qué libro leer? <strong>Nosotros lo encontramos por ti.</strong>
      </h1>

      <p>Recomendaciones personalizadas según lo que te gusta mirar,
        escuchar y sentir. Encuentra tu próxima historia sin perder tiempo.</p>

      <button>Descubre tu próximo libro</button>

      <img src='./src/assets/img/librosBanner.png'></img>
    </div>
  );
};

export default Landing;