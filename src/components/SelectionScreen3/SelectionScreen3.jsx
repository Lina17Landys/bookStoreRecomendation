import React, { useState, useEffect } from 'react';
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
  const [resultados, setResultados] = useState(autoresBase.slice(0, 10));
  const [seleccionados, setSeleccionados] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

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
    if (seleccionados.length === 3) {
      if (!user) {
        alert("Debes iniciar sesión para continuar.");
        return;
      }

      try {
        await saveUserPreferences(user.uid, { favoriteAuthors: seleccionados });
        navigate('/reader-level');
      } catch (error) {
        console.error("Error al guardar autores:", error);
        alert("Hubo un problema al guardar tu selección.");
      }
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
        <button className="boton-anterior3" onClick={() => navigate('/selection2')}>
          Anterior
        </button>
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
