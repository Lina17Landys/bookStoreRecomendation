import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectionScreen1.css";
import logo from "../../assets/logo.svg";
import { getAuth } from "firebase/auth";
import { saveUserPreferences } from "../../utils/firebaseHelpers";

const librosIniciales = [
  {
    titulo: "The Hobbit",
    autor: "J.R.R. Tolkien",
    imagen: "https://covers.openlibrary.org/b/id/6979861-M.jpg",
  },
  {
    titulo: "1984",
    autor: "George Orwell",
    imagen: "https://covers.openlibrary.org/b/id/7222246-M.jpg",
  },
  {
    titulo: "To Kill a Mockingbird",
    autor: "Harper Lee",
    imagen: "https://covers.openlibrary.org/b/id/8225260-M.jpg",
  },
  {
    titulo: "Pride and Prejudice",
    autor: "Jane Austen",
    imagen: "https://covers.openlibrary.org/b/id/8081536-M.jpg",
  },
  {
    titulo: "Harry Potter",
    autor: "J.K. Rowling",
    imagen: "https://covers.openlibrary.org/b/id/7984916-M.jpg",
  },
  {
    titulo: "The Great Gatsby",
    autor: "F. Scott Fitzgerald",
    imagen: "https://covers.openlibrary.org/b/id/7222276-M.jpg",
  },
  {
    titulo: "The Catcher in the Rye",
    autor: "J.D. Salinger",
    imagen: "https://covers.openlibrary.org/b/id/8231856-M.jpg",
  },
  {
    titulo: "The Name of the Wind",
    autor: "Patrick Rothfuss",
    imagen: "https://covers.openlibrary.org/b/id/8370616-M.jpg",
  },
  {
    titulo: "The Hunger Games",
    autor: "Suzanne Collins",
    imagen: "https://covers.openlibrary.org/b/id/7262161-M.jpg",
  },
  {
    titulo: "Dracula",
    autor: "Bram Stoker",
    imagen: "https://covers.openlibrary.org/b/id/8235119-M.jpg",
  },
];

const SelectionScreen1 = () => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  // Mostrar los libros iniciales por defecto al montar el componente
  useEffect(() => {
    setResultados(librosIniciales);
  }, []);

  useEffect(() => {
    if (busqueda.length < 3) return;

    const fetchLibros = async () => {
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(
            busqueda
          )}`
        );
        const data = await res.json();
        const librosFiltrados = data.docs
          .filter((libro) => libro.cover_i && libro.title && libro.author_name)
          .slice(0, 10)
          .map((libro) => ({
            titulo: libro.title,
            autor: libro.author_name[0],
            imagen: `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`,
          }));
        // Mantener seleccionados previos en la lista de resultados si ya no aparecen en la nueva búsqueda
        setResultados((prev) => {
          // Libros seleccionados previos que no están en los nuevos resultados
          const seleccionadosPrevios = prev.filter(
            (libro) =>
              seleccionados.includes(libro.titulo) &&
              !librosFiltrados.some((l) => l.titulo === libro.titulo)
          );
          // Fusionar manteniendo los seleccionados previos al inicio
          return [...seleccionadosPrevios, ...librosFiltrados];
        });
      } catch (err) {
        console.error("Error al buscar libros:", err);
      }
    };

    fetchLibros();
    // eslint-disable-next-line
  }, [busqueda]);

  const toggleSeleccion = (titulo) => {
    if (seleccionados.includes(titulo)) {
      setSeleccionados(seleccionados.filter((l) => l !== titulo));
    } else if (seleccionados.length < 3) {
      setSeleccionados([...seleccionados, titulo]);
    }
  };

  const handleContinuar = async () => {
    if (seleccionados.length === 3) {
      const user = getAuth().currentUser;
      if (user) {
        await saveUserPreferences(user.uid, { favoriteBooks: seleccionados });
      }
      navigate("/selection2");
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
          <a href="/recomendacion" className="activo">
            Recomendación
          </a>
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
              className={`libro-tarjeta ${
                seleccionados.includes(libro.titulo) ? "seleccionado" : ""
              }`}
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
              className={`libro-tarjeta ${
                seleccionados.includes(libro.titulo) ? "seleccionado" : ""
              }`}
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
        <button className="boton-anterior" disabled>
          Anterior
        </button>
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
