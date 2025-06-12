import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import SelectionPage1 from './pages/SelectionPage1/SelectionPage1';
import SelectionPage2 from './pages/SelectionPage2/SelectionPage2';
import SelectionPage3 from './pages/SelectionPage3/SelectionPage3';
import LandingPage from './pages/LandingPage/LandingPage';
import LibrosPage from './pages/LibrosPage/LibrosPage';
import UsuarioPage from './pages/UsuarioPage/UsuarioPage';
import EditarPerfilPage from './pages/EditarPerfilPage/EditarPerfilPage';
import ReaderLevelPage from './pages/ReaderLevelPage/ReaderLevelPage';
import RecommendationPage from './pages/RecommendationPage/RecommendationPage';
import GruposPage from './pages/GruposPage/GruposPage';
import misGrupos from './components/misGrupos/misGrupos'; // ajusta ruta si cambias ubicación
import ChatGrupo from "./components/ChatGrupo/ChatGrupo";  // ajusta ruta si cambias ubicación
import Buscar from './components/Buscar/Buscar';

function App() {
  return (
    <div id="app-wrapper">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/selection1" element={<SelectionPage1 />} />
        <Route path="/selection2" element={<SelectionPage2 />} />
        <Route path="/selection3" element={<SelectionPage3 />} />
        <Route path="/libros" element={<LibrosPage />} />
        <Route path="/usuario" element={<UsuarioPage />} />
        <Route path="/editar-perfil" element={<EditarPerfilPage />} />
        <Route path="/reader-level" element={<ReaderLevelPage />} />
        <Route path="/recomendacion" element={<RecommendationPage />} />
        <Route path="/grupos" element={<GruposPage />} />
        <Route path="/grupos/:groupId/chat" element={<ChatGrupo />} />
        <Route path="/buscar" element={<Buscar />} />
                <Route path="/mis-grupos" element={<misGrupos />} />
        {/* IMPORTANTE: Asegúrate de que esta ruta esté correcta */}
        <Route path="/grupos/:groupId/chat" element={<ChatGrupo />} />
        {/* Ruta alternativa por si acaso */}
        <Route path="/grupo/:groupId" element={<ChatGrupo />} />
      </Routes>
    </div>
  );
}

export default App;
