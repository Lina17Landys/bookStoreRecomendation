import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectionScreen1.css";
import NavBar from "../NavBar/NavBar";
import BookLoader from "../BookLoader/BookLoader";
import { FaSearch } from "react-icons/fa";

const generarIdLibro = (libro) =>
  `${libro.titulo.trim().toLowerCase()}-${libro.autor.trim().toLowerCase()}`;

const SelectionScreen1 = () => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]); // array de objetos libro
  const [loadingInicial, setLoadingInicial] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const debounceRef = useRef(null);

  const fetchIniciales = async () => {
    setLoadingInicial(true);
    try {
      const res = await fetch("https://b7b4-34-125-154-37.ngrok-free.app");
      if (!res.ok) throw new Error("Respuesta no ok");
      const data = await res.json();
      setResultados(data.libros.slice(0, 10));
    } catch (err) {
      console.error("Error al cargar libros iniciales:", err);
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

  useEffect(() => {
    fetchIniciales();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (busqueda.trim() === "") {
      fetchIniciales();
      return;
    }

    if (busqueda.length < 3) return;

    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError("");
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(busqueda)}`
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

        setResultados(librosFiltrados);
      } catch (err) {
        console.error("Error al buscar libros:", err);
        setSearchError("Error al buscar libros. Intenta de nuevo.");
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [busqueda]);

  const toggleSeleccion = (libro) => {
    const id = generarIdLibro(libro);
    const yaSeleccionado = seleccionados.find(
      (l) => generarIdLibro(l) === id
    );

    if (yaSeleccionado) {
      setSeleccionados(seleccionados.filter((l) => generarIdLibro(l) !== id));
    } else if (seleccionados.length < 3) {
      setSeleccionados([...seleccionados, libro]);
    }
  };

  const handleContinuar = () => {
    if (seleccionados.length === 3) {
      navigate("/selection2");
    }
  };

  // 👇️ Asegurarse de que los seleccionados estén en la lista final
  const idSeleccionados = new Set(seleccionados.map(generarIdLibro));
  const noSeleccionados = resultados.filter(
    (libro) => !idSeleccionados.has(generarIdLibro(libro))
  );
  const resultadosOrdenados = [...seleccionados, ...noSeleccionados];

  if (loadingInicial) {
    return (
      <div className="selection-screen1">
        <NavBar activePage="recomendacion" />
        <BookLoader />
      </div>
    );
  }

  return (
    <div className="selection-screen1">
      <NavBar activePage="inicio" />
      <h2 className="selection-title">
        Selecciona 3 libros que hayas leído o te llamen la atención
      </h2>
      <div className="ss1-buscador-contenedor">
        <input
          type="text"
          placeholder="Buscar libro"
          className="buscador-libro"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button className="boton-lupa" onClick={() => setBusqueda(busqueda)}>
          <FaSearch />
        </button>
      </div>

      {searchError && <div className="ss1-error">{searchError}</div>}

      <div className="ss1-lista">
        {resultadosOrdenados.map((libro) => {
          const idUnico = generarIdLibro(libro);
          const estaSeleccionado = idSeleccionados.has(idUnico);
          return (
            <div
              key={idUnico}
              className={`ss1-tarjeta ${estaSeleccionado ? "seleccionado" : ""}`}
              onClick={() => toggleSeleccion(libro)}
            >
              <img
                src={libro.imagen}
                alt={libro.titulo}
                className="libro-imagen"
              />
            </div>
          );
        })}
      </div>

      <div className="botones-navegacion">
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
