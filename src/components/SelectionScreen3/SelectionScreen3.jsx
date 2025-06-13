import React, { useState, useEffect, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { saveUserPreferences } from '../../utils/firebaseHelpers';
import './SelectionScreen3.css';
import NavBar from '../NavBar/NavBar';

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
  const [resultados, setResultados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const fetchAutores = async (query) => {
    const res = await fetch(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.docs.map((autor) => autor.name);
  };

  // Cargar autores aleatorios al iniciar
  useEffect(() => {
    const fetchAleatorios = async () => {
      setLoadingAleatorios(true);
      try {
        const letras = ['a', 'm', 's'];
        const respuestas = await Promise.all(letras.map((l) => fetchAutores(l)));
        const combinados = [...new Set(respuestas.flat())].slice(0, 10);
        setResultados(combinados);
      } catch (error) {
        console.error("Error al cargar autores aleatorios:", error);
      } finally {
        setLoadingAleatorios(false);
      }
    };

    fetchAleatorios();
  }, []);

  // Buscar autores manualmente
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

  const handleFinalizar = async () => {
    if (seleccionados.length !== 3) return;
    if (!user) {
      setError("Debes iniciar sesión para continuar.");
      return;
    }
    setSaving(true);
    setError('');
    try {
      await saveUserPreferences(user.uid, { favoriteAuthors: seleccionados });
      navigate('/reader-level');
    } catch (err) {
      console.error("Error al guardar autores:", err);
      setError("Hubo un problema al guardar tu selección.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="selection-screen3">
      <NavBar activePage="recomendacion" />
      <h2 className="selection-title3">Selecciona 3 autores favoritos</h2>

      <input
        type="text"
        placeholder="Buscar autor"
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
        <button className="boton-anterior3" onClick={() => navigate(-1)}>
          Anterior
        </button>
        <button
          className="boton-siguiente3"
          onClick={handleFinalizar}
          disabled={seleccionados.length !== 3 || saving}
        >
          {saving ? 'Guardando...' : 'Finalizar'}
        </button>
      </div>
      {error && (
        <div className="ss3-error" style={{ color: 'red', marginTop: '8px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default SelectionScreen3;
