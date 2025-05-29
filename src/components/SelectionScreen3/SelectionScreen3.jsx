import React, { useState, useEffect } from 'react';
import './SelectionScreen3.css';
import logo from '../../assets/logo.svg';

const autoresBase = [
  "Gabriel García Márquez",
  "J.K. Rowling",
  "J.R.R. Tolkien",
  "George Orwell",
  "Jane Austen",
  "Haruki Murakami",
  "Stephen King",
  "Isabel Allende",
  "Ernest Hemingway",
  "Leo Tolstoy",
  "Agatha Christie",
  "Mark Twain",
  "Franz Kafka",
  "Paulo Coelho",
  "Virginia Woolf"
];

const SelectionScreen3 = () => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState(autoresBase.slice(0, 10));
  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setResultados(autoresBase.slice(0, 10));
    } else {
      const filtrados = autoresBase.filter((autor) =>
        autor.toLowerCase().includes(busqueda.toLowerCase())
      );
      setResultados(filtrados.slice(0, 10));
    }
  }, [busqueda]);

  const toggleSeleccion = (autor) => {
    if (seleccionados.includes(autor)) {
      setSeleccionados(seleccionados.filter((a) => a !== autor));
    } else if (seleccionados.length < 3) {
      setSeleccionados([...seleccionados, autor]);
    }
  };

  const handleFinalizar = () => {
    if (seleccionados.length === 3) {
      console.log('Autores favoritos:', seleccionados);
      // window.location.href = '/recomendador';
    }
  };

  return (
    <div className="selection-screen3">
      <header className="selection-header3">
        <img src={logo} alt="Logo" className="selection-logo3" />
        <nav className="selection-nav3">
          <a href="/">Inicio</a>
          <a href="/mis-libros">Mis libros</a>
          <a href="/grupos">Grupos</a>
          <a href="/recomendacion" className="activo">Recomendación</a>
        </nav>
      </header>

      <h2 className="selection-title3">Selecciona 3 autores favoritos</h2>
      <input
        type="text"
        placeholder="🔍 Buscar autor"
        className="buscador-libro3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <div className="libros-lista3">
        <div className="libros-fila">
          {resultados.slice(0, 5).map((autor, index) => (
            <div
              key={index}
              className={`libro-tarjeta3 ${seleccionados.includes(autor) ? 'seleccionado' : ''}`}
              onClick={() => toggleSeleccion(autor)}
            >
              {autor}
            </div>
          ))}
        </div>
        <div className="libros-fila">
          {resultados.slice(5, 10).map((autor, index) => (
            <div
              key={index + 5}
              className={`libro-tarjeta3 ${seleccionados.includes(autor) ? 'seleccionado' : ''}`}
              onClick={() => toggleSeleccion(autor)}
            >
              {autor}
            </div>
          ))}
        </div>
      </div>

      <div className="botones-navegacion3">
        <button className="boton-anterior3" onClick={() => window.location.href = '/selection2'}>Anterior</button>
        <button
          className="boton-siguiente3"
          onClick={handleFinalizar}
          disabled={seleccionados.length !== 3}
        >
          Finalizar
        </button>
      </div>
    </div>
  );
};

export default SelectionScreen3;