import React, { useState } from 'react';
import './SelectionScreen2.css';
import logo from '../../assets/logo.svg';

const generosOpciones = [
  "Fantasía",
  "Romance",
  "Misterio",
  "Ciencia Ficción",
  "Histórico",
  "Terror",
  "Aventura",
  "Biografía",
  "Drama",
  "Clásicos"
];

const SelectionScreen2 = () => {
  const [seleccionados, setSeleccionados] = useState([]);

  const toggleSeleccion = (genero) => {
    if (seleccionados.includes(genero)) {
      setSeleccionados(seleccionados.filter((g) => g !== genero));
    } else if (seleccionados.length < 3) {
      setSeleccionados([...seleccionados, genero]);
    }
  };

  const handleContinuar = () => {
    if (seleccionados.length === 3) {
      console.log('Géneros favoritos:', seleccionados);
      // window.location.href = '/selection3';
    }
  };

  return (
    <div className="selection-screen">
      <header className="selection-header">
        <img src={logo} alt="Logo" className="selection-logo" />
        <nav className="selection-nav">
          <a href="/">Inicio</a>
          <a href="/mis-libros">Mis libros</a>
          <a href="/grupos">Grupos</a>
          <a href="/recomendacion" className="activo">Recomendación</a>
        </nav>
      </header>

      <h2 className="selection-title">
        Selecciona 3 géneros literarios que más te gustan
      </h2>
      <input
        type="text"
        placeholder="🔍 Buscar género"
        className="buscador-libro"
        disabled
      />
      <div className="libros-lista">
        <div className="libros-fila">
          {generosOpciones.slice(0, 5).map((genero, index) => (
            <div
              key={index}
              className={`libro-tarjeta ${seleccionados.includes(genero) ? 'seleccionado' : ''}`}
              onClick={() => toggleSeleccion(genero)}
            >
              <div className="genero-imagen">{genero}</div>
            </div>
          ))}
        </div>
        <div className="libros-fila">
          {generosOpciones.slice(5, 10).map((genero, index) => (
            <div
              key={index + 5}
              className={`libro-tarjeta ${seleccionados.includes(genero) ? 'seleccionado' : ''}`}
              onClick={() => toggleSeleccion(genero)}
            >
              <div className="genero-imagen">{genero}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="botones-navegacion">
        <button className="boton-anterior" onClick={() => window.location.href = '/selection1'}>Anterior</button>
        <button
          className="boton-siguiente"
          onClick={handleContinuar}
          disabled={seleccionados.length !== 3}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default SelectionScreen2;
