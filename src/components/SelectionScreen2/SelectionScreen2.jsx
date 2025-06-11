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
  const navigate = useNavigate();

  const toggleSeleccion = (genero) => {
    if (seleccionados.includes(genero)) {
      setSeleccionados(seleccionados.filter((g) => g !== genero));
    } else if (seleccionados.length < 3) {
      setSeleccionados([...seleccionados, genero]);
    }
  };

  const handleContinuar = async () => {
    if (seleccionados.length === 3) {
      const user = getAuth().currentUser;
      if (user) {
        await saveUserPreferences(user.uid, { favoriteGenres: seleccionados });
      }
      navigate("/selection3");
    }
  };

  return (
    <div className="selection-screen">
      <NavBar activePage="recomendacion" />
      <h2 className="selection-title">
        Selecciona 3 géneros literarios que más te gustan
      </h2>
     
      <div className="libros-lista">
        <div className="libros-fila">
          {generosOpciones.slice(0, 5).map((genero, index) => (
            <div
              key={index}
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
          {generosOpciones.slice(5, 10).map((genero, index) => (
            <div
              key={index + 5}
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
          className="boton-anterior"
          onClick={() => (window.location.href = "/selection1")}
        >
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

export default SelectionScreen2;
