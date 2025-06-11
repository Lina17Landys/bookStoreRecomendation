import React from 'react';
import logo from "../../assets/logo.svg";
import './NavBar.css';

const NavBar = ({ activePage }) => {
  return (
    <header className="selection-header">
      <img src={logo} alt="Logo" className="selection-logo" />
      <nav className="selection-nav">
        <a href="/" className={activePage === 'inicio' ? 'activo' : ''}>Inicio</a>
        <a href="/mis-libros" className={activePage === 'mis-libros' ? 'activo' : ''}>Mis libros</a>
        <a href="/grupos" className={activePage === 'grupos' ? 'activo' : ''}>Grupos</a>
        <a href="/recomendacion" className={activePage === 'recomendacion' ? 'activo' : ''}>Recomendación</a>
      </nav>
    </header>
  );
};

export default NavBar;
