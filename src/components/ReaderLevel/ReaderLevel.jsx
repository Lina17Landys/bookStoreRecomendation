import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReaderLevel.css";
import logo from "../../assets/logo.svg";
import { getAuth } from "firebase/auth";
import { saveUserPreferences } from "../../utils/firebaseHelpers";
import NavBar from "../NavBar/NavBar";

const ReaderLevelScreen = () => {
  const [selectedLevel, setSelectedLevel] = useState("");
  const navigate = useNavigate();

  const handleSelect = (level) => {
    setSelectedLevel(level);
  };

  const handleBack = () => {
    navigate("/selection3"); // ← Regresa a la pantalla anterior
  };

  const handleNext = async () => {
    if (!selectedLevel) {
      alert("Por favor, selecciona un nivel.");
      return;
    }

    const user = getAuth().currentUser;
    if (user) {
      await saveUserPreferences(user.uid, { readerLevel: selectedLevel });
    }

    navigate("/recomendacion");
  };

  return (
    <div className="reader-level-container">
      <NavBar activePage="recomendacion" />

      <h2 className="reader-title">¿Cuál es tu nivel de lector actual?</h2>

      <div className="level-options">
        {["Principiante", "Intermedio", "Avanzado"].map((level) => (
          <button
            key={level}
            className={`level-btn ${selectedLevel === level ? "selected" : ""}`}
            onClick={() => handleSelect(level)}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="botones-navegacion1">
        <button className="boton-anterior1" onClick={handleBack}>
          Anterior
        </button>
        <button className="boton-siguiente1" onClick={handleNext}>
          Generar recomendación
        </button>
      </div>
    </div>
  );
};

export default ReaderLevelScreen;
