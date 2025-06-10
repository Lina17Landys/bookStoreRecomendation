import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <div className="features-container">
      <div className="feature-card">
        <img src="./src/assets/img/persona.svg" alt="Recomendación personal" />
        <div className="feature-content">
          <h3>Recomendación personal</h3>
          <p>
            Recibe sugerencias personalizadas basado en libros, series, artistas y emociones. Ideal para empezar a leer o continuar sin perder el hilo.
          </p>
        </div>
      </div>

      <div className="feature-card">
        <img src="./src/assets/img/grupo.svg" alt="Lectura en grupo" />
        <div className="feature-content">
          <h3>Lectura en grupo</h3>
          <p>
            Crea tu grupo de lectura y recibe recomendaciones pensadas para todos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
