import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { auth, db } from "../../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./NavBar.css";

const NavBar = ({ activePage }) => {
  const navigate = useNavigate();
  const [userPhoto, setUserPhoto] = useState(null);
  const [userName, setUserName] = useState(""); // Para la inicial
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const data = userDoc.data();
          setUserPhoto(data?.photoURL || user.photoURL || "");
          setUserName(user.displayName || data?.nombre || "");
        } catch (error) {
          console.error("Error al obtener el perfil del usuario:", error);
        }
      } else {
        setUserPhoto(null);
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const goToProfile = () => {
    navigate("/usuario");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/buscar?query=${encodeURIComponent(searchTerm)}`);
  };

  const AvatarInicial = ({ nombre }) => {
    const inicial = nombre ? nombre.charAt(0).toUpperCase() : "?";
    return <div className="avatar-inicial">{inicial}</div>;
  };

  return (
    <header className="selection-header">
      <div className="nav-left">
        <img src={logo} alt="Logo" className="selection-logo" />
      </div>

      <div className="nav-center">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="nav-search-input"
            placeholder="Buscar libros, usuarios, grupos..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>
      </div>

      <div className="nav-right">
        <nav className="selection-nav">
          <a href="/selection1" className={activePage === "inicio" ? "activo" : ""}>
            Inicio
          </a>
          <a
            href="/libros"
            className={activePage === "mis-libros" ? "activo" : ""}
          >
            Mis libros
          </a>
          <a
            href="/grupos"
            className={activePage === "grupos" ? "activo" : ""}
          >
            Grupos
          </a>
          <a
            href="/recomendacion"
            className={activePage === "recomendacion" ? "activo" : ""}
          >
            Recomendación
          </a>
        </nav>

        <div className="perfil-circle" onClick={goToProfile}>
          {userPhoto === null ? (
            <div className="perfil-loader"></div>
          ) : userPhoto ? (
            <img src={userPhoto} alt="Perfil" className="fotoPerfil" />
          ) : (
            <AvatarInicial nombre={userName} />
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
