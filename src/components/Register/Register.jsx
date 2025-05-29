import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import logo from '../../assets/logo.svg';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Cuenta creada con éxito');
      navigate('/selection1');
    } catch (error) {
      alert('Error al registrar: ' + error.message);
    }
  };

  return (
    <div className="register">
      <header className="register-header">
        <img src={logo} alt="Logo" className="register-logo" />
      </header>

      <div className="register-card">
        <h1 className="register-title">Crear cuenta</h1>

        <form className="register-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="name" className="input-label">Nombre</label>
            <input
              type="text"
              id="name"
              className="input-field"
              placeholder="Escribe nombre y apellido"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">Confirma la contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              className="input-field"
              placeholder="Al menos 6 caracteres"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="register-button" >Crear cuenta</button>
        </form>

        <p className="register-terms">
          By creating an account, you agree to the Goodreads <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </p>

        <p className="register-login-link">
          Already have an account? <a href="/">Ingresa</a>
        </p>
      </div>
    </div>
  );
};

export default Register;