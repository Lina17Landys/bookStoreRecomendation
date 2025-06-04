import React from 'react';
import './RecomendacionesLibros.css';

const RecomendacionesLibros = ({ libros = [] }) => {
  return (
    <div className="libros-recomendados-container">
      <div className="libros-header">
        <h3>Maria Paula libros</h3>
        <a href="/mis-libros" className="ver-mas">Más</a>
      </div>

      {libros.length === 0 ? (
        <p className="sin-recomendaciones">Todavía no tienes recomendaciones</p>
      ) : (
        <div className="libros-grid">
          {libros.map((libro, index) => (
            <div className="libro-item" key={index}>
              <img src={libro.portada} alt={libro.titulo} className="libro-portada" />
              <p className="libro-titulo"><strong>{libro.titulo}</strong></p>
              <p className="libro-autor">{libro.autor}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecomendacionesLibros;
