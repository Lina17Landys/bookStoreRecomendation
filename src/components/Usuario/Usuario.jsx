import React from 'react';
import logo from '../../assets/logo.svg';
import './Usuario.css';

const Usuario = () => {
  return (
    <div id="usuario-container">
  <header className="selection-header">
    <div className="left-section">
      <img src={logo} alt="Logo" className="selection-logo" />
      <nav className="selection-nav">
        <a href="/">Inicio</a>
        <a href="/mis-libros" className="activo">Mis libros</a>
        <a href="/grupos">Grupos</a>
        <a href="/recomendacion">Recomendación</a>
      </nav>
    </div>
    <img src="./src/assets/img/fotoPerfil.svg" alt="Perfil" className="fotoPerfil" />
  </header>

</div>
  );
};

export default Usuario;
