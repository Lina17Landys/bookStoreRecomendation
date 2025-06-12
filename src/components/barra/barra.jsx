import React from 'react';
import { Link } from 'react-router-dom';
import './barra.css';

function Barra() {
  return (
    <div id="barra-container">
    <img src='./assets/logo.svg'></img>      
    <div className="barra-buttons">
        <Link to="/login" className="barra-button">Iniciar Sesión</Link>
        <Link to="/register" className="barra-button">Crear Cuenta</Link>
      </div>
    </div>
  );
}

export default Barra;