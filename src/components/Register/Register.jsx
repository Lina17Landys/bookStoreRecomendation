import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../services/firebaseConfig';
import logo from '../../assets/logo.svg';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      // Verifica si el username ya existe
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert('Ese nombre de usuario ya está en uso');
        setLoading(false);
        return;
      }

      // Crea el usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        name,
        username,
        email,
        photoURL: '',
        descripcion: '',
        books: [],
        groups: [],
        friends: []
      });

      alert('Cuenta creada con éxito');
      navigate('/selection1');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error al registrar: ' + error.message);
    } finally {
      setLoading(false);
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
            <label htmlFor="username" className="input-label">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              className="input-field"
              placeholder="Ej. paulisortize"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          <button type="submit" className="register-button">Crear cuenta</button>
        </form>

        <p className="register-terms">
          Al crear una cuenta aceptas los <a href="#">Términos de servicio</a> y la <a href="#">Política de privacidad</a> de Goodrecoms.
        </p>

        <p className="register-login-link">
          ¿Ya tienes una cuenta? <a href="/login">Ingresa</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
