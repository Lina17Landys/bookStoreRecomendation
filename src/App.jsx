import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Páginas
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import SelectionPage1 from './pages/SelectionPage1/SelectionPage1';
import SelectionPage2 from './pages/SelectionPage2/SelectionPage2';
import SelectionPage3 from './pages/SelectionPage3/SelectionPage3';
import LandingPage from './pages/LandingPage/LandingPage';
import LibrosPage from './pages/LibrosPage/LibrosPage';
import UsuarioPage from './pages/UsuarioPage/UsuarioPage';
import EditarPerfilPage from './pages/EditarPerfilPage/EditarPerfilPage';

function App() {
  return (
    <div id="app-wrapper">
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/selection1" element={<SelectionPage1 />} />
        <Route path="/selection2" element={<SelectionPage2 />} />
        <Route path="/selection3" element={<SelectionPage3 />} />
        <Route path="/libros" element={<LibrosPage />} />
        <Route path="/usuario" element={<UsuarioPage />} />
        <Route path="/editar-perfil" element={<EditarPerfilPage />} />
      </Routes>
    </div>
  );
}

export default App;