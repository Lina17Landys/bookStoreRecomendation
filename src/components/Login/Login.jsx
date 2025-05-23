import React, { useState } from 'react';
import './Login.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import logo from '../../assets/logo.svg'; 
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Inicio de sesión exitoso');
      navigate('/selection1');
    } catch (error) {
      alert('Error al iniciar sesión: ' + error.message);
    }
  };

  return (
    <div className="login">
      <header className="login-header">
        <img src={logo} alt="Logo" className="login-logo" />
      </header>

      <div className="login-card">
        <h1 className="login-welcome">Bienvenido de nuevo</h1>
        <p className="login-subtitle">Ingresa tus datos</p>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email</label>
            <input
              type="email"
              id="email"
              className="input-field"
              placeholder="Escribe tu email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Contraseña</label>
            <input
              type="password"
              id="password"
              className="input-field"
              placeholder="Al menos 6 caracteres"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button">Ingresa</button>
        </form>

        <p className="login-terms">
          By creating an account, you agree to the Goodreads <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </p>

        <p className="login-register-link">
          ¿No tienes una cuenta? <a href="/register">Crea tu cuenta</a>
        </p>
      </div>
    </div>
  );
};

export default Login;