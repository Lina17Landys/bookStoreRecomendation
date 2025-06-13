import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { saveUserPreferences } from "../../utils/firebaseHelpers";
import "./SelectionScreen3.css";
import NavBar from "../NavBar/NavBar";
import BookLoader from "../BookLoader/BookLoader";
import { FaSearch } from "react-icons/fa";

const SelectionScreen3 = () => {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const normalizar = (nombre) => nombre.trim().toLowerCase();

  const generarQueryRandom = () => {
    const letras = "abcdefghijklmnopqrstuvwxyz";
    const largo = Math.floor(Math.random() * 3) + 2;
    return Array.from({ length: largo }, () =>
      letras.charAt(Math.floor(Math.random() * letras.length))
    ).join("");
  };

  const fetchAutoresRandom = async () => {
    setLoading(true);
    try {
      const queries = Array.from({ length: 5 }, () => generarQueryRandom());
      const respuestas = await Promise.all(
        queries.map(async (q) => {
          const res = await fetch(
            `https://openlibrary.org/search/authors.json?q=${q}`
          );
          const data = await res.json();
          return data.docs.map((a) => a.name);
        })
      );
      const combinados = [...new Set(respuestas.flat())]
        .filter(Boolean)
        .slice(0, 20);
      setResultados(combinados);
    } catch (error) {
      console.error("Error al cargar autores aleatorios:", error);
      setError("No se pudieron cargar autores. Intenta recargar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutoresRandom();
  }, []);

  useEffect(() => {
    const fetchBusqueda = async () => {
      if (busqueda.trim() === "") {
        fetchAutoresRandom();
        return;
      }

      try {
        const res = await fetch(
          `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(
            busqueda
          )}`
        );
        const data = await res.json();
        const nombres = data.docs.map((a) => a.name).filter(Boolean);
        setResultados(nombres.slice(0, 20));
      } catch (error) {
        console.error("Error al buscar autores:", error);
      }
    };

    fetchBusqueda();
  }, [busqueda]);

  const toggleSeleccion = (autor) => {
    const autorNormalizado = normalizar(autor);
    const yaSeleccionado = seleccionados.some(
      (a) => normalizar(a) === autorNormalizado
    );

    if (yaSeleccionado) {
      setSeleccionados(
        seleccionados.filter((a) => normalizar(a) !== autorNormalizado)
      );
    } else if (seleccionados.length < 3) {
      setSeleccionados([...seleccionados, autor]);
    }
  };

  const handleFinalizar = async () => {
    if (seleccionados.length !== 3) return;
    if (!user) {
      setError("Debes iniciar sesión para continuar.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await saveUserPreferences(user.uid, { favoriteAuthors: seleccionados });
      navigate("/reader-level");
    } catch (err) {
      console.error("Error al guardar autores:", err);
      setError("Hubo un problema al guardar tu selección.");
    } finally {
      setSaving(false);
    }
  };

  const renderAutores = () => {
    // Normalizar resultados y eliminar duplicados por nombre
    const unicos = Array.from(
      new Map(resultados.map((a) => [normalizar(a), a])).values()
    );

    // Separar en seleccionados y no seleccionados
    const ordenados = [
      ...seleccionados,
      ...unicos.filter(
        (autor) =>
          !seleccionados.some(
            (sel) => normalizar(sel) === normalizar(autor)
          )
      ),
    ];

    return (
      <>
        <div className="libros-fila">
          {ordenados.slice(0, 5).map((autor, i) => (
            <div
              key={`autor1-${i}-${autor}`}
              className={`libro-tarjeta3 ${
                seleccionados.some(
                  (a) => normalizar(a) === normalizar(autor)
                )
                  ? "seleccionado"
                  : ""
              }`}
              onClick={() => toggleSeleccion(autor)}
            >
              {autor}
            </div>
          ))}
        </div>
        <div className="libros-fila">
          {ordenados.slice(5, 10).map((autor, i) => (
            <div
              key={`autor2-${i}-${autor}`}
              className={`libro-tarjeta3 ${
                seleccionados.some(
                  (a) => normalizar(a) === normalizar(autor)
                )
                  ? "seleccionado"
                  : ""
              }`}
              onClick={() => toggleSeleccion(autor)}
            >
              {autor}
            </div>
          ))}
        </div>
      </>
    );
  };

  if (loading || saving) {
    return (
      <div className="selection-screen3">
        <NavBar activePage="recomendacion" />
        <BookLoader />
      </div>
    );
  }

  return (
    <div className="selection-screen3">
      <NavBar activePage="inicio" />
      <h2 className="selection-title3">Selecciona 3 autores favoritos</h2>

      <div className="ss3-buscador-contenedor">
        <input
          type="text"
          placeholder="Buscar autor"
          className="buscador-libro3"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button className="boton-lupa">
          <FaSearch />
        </button>
      </div>

      <div className="libros-lista3">{renderAutores()}</div>

      <div className="botones-navegacion3">
        <button className="boton-anterior3" onClick={() => navigate(-1)}>
          Anterior
        </button>
        <button
          className="boton-siguiente3"
          onClick={handleFinalizar}
          disabled={seleccionados.length !== 3 || saving}
        >
          {saving ? "Guardando..." : "Finalizar"}
        </button>
      </div>

      {error && <div className="ss3-error">{error}</div>}
    </div>
  );
};

export default SelectionScreen3;
