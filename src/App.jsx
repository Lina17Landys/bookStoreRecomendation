import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Páginas
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import SelectionPage1 from './pages/SelectionPage1/SelectionPage1';
import SelectionPage2 from './pages/SelectionPage2/SelectionPage2';
import SelectionPage3 from './pages/SelectionPage3/SelectionPage3';

function App() {
  return (
    <Router>
      <div id="app-wrapper">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/selection1" element={<SelectionPage1 />} />
          <Route path="/selection2" element={<SelectionPage2 />} />
          <Route path="/selection3" element={<SelectionPage3 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;