import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import "./PerfilSection.css";
import { FiLogOut, FiSettings } from "react-icons/fi";

const PerfilUsuario = ({ user }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [myBooks, setMyBooks] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (authUser) => {
      setCurrentUser(authUser);
      setLoading(false);
    });

    return () => unsubAuth();
  }, [auth]);

  useEffect(() => {
    if (!currentUser?.uid) {
      setMyBooks([]);
      setMyGroups([]);
      return;
    }

    const ref = doc(db, "users", currentUser.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setMyBooks(data.myBooks || []);
        setMyGroups(data.myGroups || []); // Cambio aquí: usar myGroups consistentemente
      } else {
        setMyBooks([]);
        setMyGroups([]);
      }
    });

    return () => unsub();
  }, [currentUser]);

  const handleCerrarSesion = () => {
    signOut(auth)
      .then(() => navigate("/"))
      .catch((error) => console.error("Error al cerrar sesión:", error));
  };

  const librosLeidos = myBooks.filter((libro) => libro.leido).length;

  // Componente para mostrar inicial si no hay foto
  const AvatarInicial = ({ nombre }) => {
    const inicial = nombre ? nombre.charAt(0).toUpperCase() : "?";
    return <div className="perfil-avatar-inicial">{inicial}</div>;
  };

  if (loading) {
    return (
      <div className="perfil-container">
        <div className="perfil-loading">Cargando perfil...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="perfil-container">
        <div className="perfil-error">Error al cargar el perfil</div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      {user.photoURL ? (
        <img src={user.photoURL} alt="Foto de perfil" className="perfil-foto" />
      ) : (
        <AvatarInicial nombre={user.displayName || user.nombre} />
      )}

      <div className="perfil-info">
        <div className="perfil-top">
          <h2 className="username">@{user.username || user.email}</h2>
          <div className="perfil-actions">
            <Link to="/editar-perfil" className="editar-btn">
              <FiSettings size={16} />
            </Link>
            <button onClick={handleCerrarSesion} className="cerrar-sesion-btn">
              <FiLogOut size={16} />
            </button>
          </div>
        </div>

        <div className="estadisticas">
          <p>
            <strong>{librosLeidos}</strong> Libros leídos
          </p>
          <p>
            <strong>{myBooks.length}</strong> Total libros
          </p>
          <p>
            <strong>{myGroups.length}</strong> Grupos
          </p>
          <p>
            <strong>{user.friends?.length || 0}</strong> Amigos
          </p>
        </div>

        <div className="descripcion">
          <p className="nombre-real">{user.displayName || user.nombre}</p>
          <p className="bio">
            {user.descripcion || "Agrega una descripción en tu perfil ✨"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;