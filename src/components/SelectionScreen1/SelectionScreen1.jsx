import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectionScreen1.css";
import NavBar from "../NavBar/NavBar";
import BookLoader from "../BookLoader/BookLoader";

const SelectionScreen1 = () => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loadingInicial, setLoadingInicial] = useState(true);

  useEffect(() => {
    const fetchIniciales = async () => {
      try {
        const res = await fetch(
          "https://df11-34-58-146-38.ngrok-free.app/libros"
        );
        if (!res.ok) throw new Error("Respuesta no ok");
        const data = await res.json();
        setResultados(data.libros.slice(0, 10));
      } catch (err) {
        console.error("Error al cargar libros iniciales:", err);
        // Fallback data
        setResultados([
          {
            titulo: "Cien años de soledad",
            autor: "Gabriel García Márquez",
            imagen: "https://covers.openlibrary.org/b/id/8231996-M.jpg",
          },
          {
            titulo: "1984",
            autor: "George Orwell",
            imagen: "https://covers.openlibrary.org/b/id/7222246-M.jpg",
          },
          {
            titulo: "Orgullo y prejuicio",
            autor: "Jane Austen",
            imagen: "https://covers.openlibrary.org/b/id/8225291-M.jpg",
          },
          {
            titulo: "El Principito",
            autor: "Antoine de Saint-Exupéry",
            imagen: "https://covers.openlibrary.org/b/id/8469476-M.jpg",
          },
          {
            titulo: "Fahrenheit 451",
            autor: "Ray Bradbury",
            imagen: "https://covers.openlibrary.org/b/id/7984916-M.jpg",
          },
          {
            titulo: "Crónica de una muerte anunciada",
            autor: "Gabriel García Márquez",
            imagen: "https://covers.openlibrary.org/b/id/10563961-M.jpg",
          },
          {
            titulo: "Rayuela",
            autor: "Julio Cortázar",
            imagen: "https://covers.openlibrary.org/b/id/9782165-M.jpg",
          },
          {
            titulo: "La sombra del viento",
            autor: "Carlos Ruiz Zafón",
            imagen: "https://covers.openlibrary.org/b/id/8231852-M.jpg",
          },
          {
            titulo: "Don Quijote de la Mancha",
            autor: "Miguel de Cervantes",
            imagen: "https://covers.openlibrary.org/b/id/5546156-M.jpg",
          },
          {
            titulo: "Matar a un ruiseñor",
            autor: "Harper Lee",
            imagen: "https://covers.openlibrary.org/b/id/8225631-M.jpg",
          },
        ]);
      } finally {
        setLoadingInicial(false);
      }
    };

    fetchIniciales();
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
        setResultados((prev) => {
          const seleccionadosPrevios = prev.filter(
            (libro) =>
              seleccionados.includes(libro.titulo) &&
              !librosFiltrados.some((l) => l.titulo === libro.titulo)
          );
          return [...seleccionadosPrevios, ...librosFiltrados];
        });
      } catch (err) {
        console.error("Error al buscar libros:", err);
      }
    };

    fetchLibros();
  }, [busqueda, seleccionados]);

  if (loadingInicial) {
    return (
      <div className="selection-screen1">
        <NavBar activePage="recomendacion" />
        <BookLoader />
      </div>
    );
  }

  const toggleSeleccion = (titulo) => {
    if (seleccionados.includes(titulo)) {
      setSeleccionados(seleccionados.filter((l) => l !== titulo));
    } else if (seleccionados.length < 3) {
      setSeleccionados([...seleccionados, titulo]);
    }
  };

  const handleContinuar = () => {
    if (seleccionados.length === 3) {
      navigate("/selection2");
    }
  };

  return (
    <div className="selection-screen1">
      <NavBar activePage="inicio" />
      <h2 className="selection-title">
        Selecciona 3 libros que hayas leído o te llamen la atención
      </h2>
      <input
        type="text"
        placeholder="Buscar libro"
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
