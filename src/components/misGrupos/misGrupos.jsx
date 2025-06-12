import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/firebaseConfig";
import NavBar from "../NavBar/NavBar";
import BookLoader from "../BookLoader/BookLoader"
import "./MisGrupos.css";

const MisGrupos = () => {
  const [user, setUser] = useState(null);
  const [misGrupos, setMisGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const ref = doc(db, "users", u.uid);
        const unsubSnap = onSnapshot(ref, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setMisGrupos(data.myGroups || []);
            setLoading(false);
          } else {
            setMisGrupos([]);
            setLoading(false);
          }
        });
        return () => unsubSnap();
      } else {
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  const handleSalir = async (grupoId) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const nuevaLista = misGrupos.filter((g) => g.id !== grupoId);
    await updateDoc(ref, {
      myGroups: nuevaLista,
    });
  };

  const handleVerChat = (grupo) => {
    console.log("Navegando a grupo:", grupo);
    console.log("ID del grupo:", grupo.id);
    
    // Verificar que el grupo tenga ID
    if (!grupo.id) {
      console.error("El grupo no tiene ID:", grupo);
      alert("Error: El grupo no tiene un ID válido");
      return;
    }
    
    // Navegar al chat del grupo
    navigate(`/grupos/${grupo.id}/chat`);
  };

  return (
    <>
      <NavBar activePage="grupos" />
      <div className="grupos-container">
        <h2 className="titulo-principal">Mis grupos de lectura</h2>
        {loading ? (
          <div className="cargando">
            <BookLoader />
            <p>Cargando grupos...</p>
          </div>
        ) : misGrupos.length === 0 ? (
          <p className="mensaje-vacio">No te has unido a ningún grupo todavía.</p>
        ) : (
          <div className="grupos-grid">
            {misGrupos.map((g, index) => (
              <div key={g.id || `grupo-${index}`} className="grupo-card">
                <div className="grupo-avatar">{g.nombre?.charAt(0).toUpperCase() || "G"}</div>
                <div className="grupo-info">
                  <h3 className="grupo-nombre">{g.nombre}</h3>
                  <p className="grupo-descripcion">{g.descripcion}</p>
                  {/* Debug info - quitar después */}
                  <small style={{color: '#666'}}>ID: {g.id || 'Sin ID'}</small>
                </div>
                <div className="grupo-botones">
                  <button 
                    className="btn-chat" 
                    onClick={() => handleVerChat(g)}
                    disabled={!g.id}
                  >
                    Ver chat
                  </button>
                  <button className="btn-salir" onClick={() => handleSalir(g.id)}>
                    Salir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MisGrupos;