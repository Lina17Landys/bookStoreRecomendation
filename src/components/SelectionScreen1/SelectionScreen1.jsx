import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectionScreen1.css';
import logo from '../../assets/logo.svg';

const SelectionScreen1 = () => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
    const fetchIniciales = async () => {
      try {
        const res = await fetch("https://df11-34-58-146-38.ngrok-free.app/libros");
        const data = await res.json();
        setResultados(data.libros.slice(0, 10));
      } catch (err) {
        console.error("Error al cargar libros iniciales:", err);
      }
    };
    fetchIniciales();
  }, []);

  useEffect(() => {
    if (busqueda.length < 3) return;

    const fetchLibros = async () => {
      try {
        const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(busqueda)}`);
        const data = await res.json();
        const librosFiltrados = data.docs
          .filter((libro) => libro.cover_i && libro.title && libro.author_name)
          .slice(0, 10)
          .map((libro) => ({
            titulo: libro.title,
            autor: libro.author_name[0],
            imagen: `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`
          }));
        setResultados((prev) => {
          const seleccionadosPrevios = prev.filter(
            (libro) => seleccionados.includes(libro.titulo) && !librosFiltrados.some(l => l.titulo === libro.titulo)
          );
          return [...seleccionadosPrevios, ...librosFiltrados];
        });
      } catch (err) {
        console.error('Error al buscar libros:', err);
      }
    };

    fetchLibros();
  }, [busqueda, seleccionados]);

  const toggleSeleccion = (titulo) => {
    if (seleccionados.includes(titulo)) {
      setSeleccionados(seleccionados.filter((l) => l !== titulo));
    } else if (seleccionados.length < 3) {
      setSeleccionados([...seleccionados, titulo]);
    }
  };

  const handleContinuar = () => {
    if (seleccionados.length === 3) {
      navigate('/selection2');
    }
  };

  return (
    <div className="selection-screen1">
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
        Selecciona 3 libros que hayas leído o te llamen la atención
      </h2>
      <input
        type="text"
        placeholder="🔍 Buscar libro"
        className="buscador-libro"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <div className="libros-lista">
        <div className="libros-fila">
          {resultados.slice(0, 5).map((libro, index) => (
            <div
              key={index}
              className={`libro-tarjeta ${seleccionados.includes(libro.titulo) ? 'seleccionado' : ''}`}
              onClick={() => toggleSeleccion(libro.titulo)}
            >
              <img
                src={libro.imagen}
                alt={libro.titulo}
                className="libro-imagen"
              />
            </div>
          ))}
        </div>
        <div className="libros-fila">
          {resultados.slice(5, 10).map((libro, index) => (
            <div
              key={index + 5}
              className={`libro-tarjeta ${seleccionados.includes(libro.titulo) ? 'seleccionado' : ''}`}
              onClick={() => toggleSeleccion(libro.titulo)}
            >
              <img
                src={libro.imagen}
                alt={libro.titulo}
                className="libro-imagen"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="botones-navegacion">
        <button className="boton-anterior" disabled>Anterior</button>
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

export default SelectionScreen1;
