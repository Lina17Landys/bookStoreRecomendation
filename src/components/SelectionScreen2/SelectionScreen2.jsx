import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectionScreen2.css";
import { getAuth } from "firebase/auth";
import { saveUserPreferences } from "../../utils/firebaseHelpers";
import NavBar from "../NavBar/NavBar";

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
  "Clásicos",
];

const SelectionScreen2 = () => {
  const [seleccionados, setSeleccionados] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleSeleccion = (genero) => {
    if (seleccionados.includes(genero)) {
      setSeleccionados(seleccionados.filter((g) => g !== genero));
    } else if (seleccionados.length < 3) {
      setSeleccionados([...seleccionados, genero]);
    }
  };

  const handleContinuar = async () => {
    if (seleccionados.length !== 3) return;
    setSaving(true);
    setError('');
    try {
      const user = getAuth().currentUser;
      if (user) {
        await saveUserPreferences(user.uid, { favoriteGenres: seleccionados });
      }
      navigate("/selection3");
    } catch (err) {
      console.error("Error al guardar preferencias:", err);
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="selection-screen">
      <NavBar activePage="inicio" />
      <h2 className="selection-title">
        Selecciona 3 géneros literarios que más te gustan
      </h2>
     
      <div className="libros-lista">
        <div className="libros-fila">
          {generosOpciones.slice(0, 5).map((genero) => (
            <div
              key={genero}
              className={`libro-tarjeta ${
                seleccionados.includes(genero) ? "seleccionado" : ""
              }`}
              onClick={() => toggleSeleccion(genero)}
            >
              <div className="genero-imagen">{genero}</div>
            </div>
          ))}
        </div>
        <div className="libros-fila">
          {generosOpciones.slice(5, 10).map((genero) => (
            <div
              key={genero}
              className={`libro-tarjeta ${
                seleccionados.includes(genero) ? "seleccionado" : ""
              }`}
              onClick={() => toggleSeleccion(genero)}
            >
              <div className="genero-imagen">{genero}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="botones-navegacion">
        <button
          className="boton-anterior2"
          onClick={() => navigate(-1)}
        >
          Anterior
        </button>
        <button
          className="boton-siguiente"
          onClick={handleContinuar}
          disabled={seleccionados.length !== 3 || saving}
        >
          {saving ? 'Guardando...' : 'Siguiente'}
        </button>
      </div>
      {error && <div className="ss2-error" style={{ color: 'red', marginTop: '8px' }}>{error}</div>}
    </div>
  );
};

export default SelectionScreen2;
