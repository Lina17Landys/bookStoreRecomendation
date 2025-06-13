import React, { useState, useEffect, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { saveUserPreferences } from '../../utils/firebaseHelpers';
import './SelectionScreen3.css';
import NavBar from '../NavBar/NavBar';

const SelectionScreen3 = () => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const debounceRef = useRef(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const query = busqueda.trim();
      if (!query) {
        setResultados([]);
        return;
      }
      setSearchLoading(true);
      setSearchError('');
      try {
        const res = await fetch(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const autores = data.docs.slice(0, 10).map((doc) => {
          return {
            nombre: doc.name,
            photo: doc.photo_id
              ? `https://covers.openlibrary.org/a/id/${doc.photo_id}-M.jpg`
              : null,
          };
        });
        setResultados(autores);
      } catch (err) {
        console.error('Error al cargar autores:', err);
        setSearchError('No se pudieron cargar los autores.');
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
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
        placeholder="🔍 Buscar autor"
        className="buscador-libro3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      {searchLoading && <div className="ss3-loading">Cargando autores...</div>}
      {searchError && <div className="ss3-error">{searchError}</div>}
      <div className="libros-lista3">
        <div className="libros-fila">
          {resultados.slice(0, 5).map((autorObj) => (
            <div
              key={autorObj.nombre}
              className={`libro-tarjeta3 ${seleccionados.includes(autorObj.nombre) ? 'seleccionado' : ''}`}
              onClick={() => toggleSeleccion(autorObj.nombre)}
            >
              {autorObj.photo && (
                <img
                  src={autorObj.photo}
                  alt={autorObj.nombre}
                  style={{ width: '100%', height: 'auto', marginBottom: '8px' }}
                />
              )}
              <span>{autorObj.nombre}</span>
            </div>
          ))}
        </div>
        <div className="libros-fila">
          {resultados.slice(5, 10).map((autorObj) => (
            <div
              key={autorObj.nombre}
              className={`libro-tarjeta3 ${seleccionados.includes(autorObj.nombre) ? 'seleccionado' : ''}`}
              onClick={() => toggleSeleccion(autorObj.nombre)}
            >
              {autorObj.photo && (
                <img
                  src={autorObj.photo}
                  alt={autorObj.nombre}
                  style={{ width: '100%', height: 'auto', marginBottom: '8px' }}
                />
              )}
              <span>{autorObj.nombre}</span>
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
