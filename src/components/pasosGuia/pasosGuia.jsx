import React from 'react';
import './pasosGuia.css';

const PasosGuia = () => {
  return (
    <div className="contenedor-centrado">
      <div id="guiaPasos-wrapper">
        <div className="pasos-container">
          <div className="paso">
            <div className="numero">1</div>
            <h3>Responde un <br />cuestionario rápido</h3>
            <p>Cuéntanos qué te gusta (libros, series, artistas, tu mood).</p>
          </div>
          <div className="paso">
            <div className="numero">2</div>
            <h3>Recibe tus <br />recomendaciones</h3>
            <p>Te mostramos libros que coinciden con tu perfil.</p>
          </div>
          <div className="paso">
            <div className="numero">3</div>
            <h3>Guárdalos o pide <br />más por Telegram</h3>
            <p>Nuestro bot te da la siguiente opción en segundos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasosGuia;

