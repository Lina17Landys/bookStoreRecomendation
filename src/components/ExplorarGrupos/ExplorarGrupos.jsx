import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/firebaseConfig";
import { getSuggestedGroups } from "../../utils/groupSuggestions";
import { joinGroup } from "../../utils/groupUtils";
import NavBar from "../NavBar/NavBar";
import BookLoader from "../BookLoader/BookLoader";
import "./ExplorarGrupos.css";

const ExplorarGrupos = () => {
  const [user, setUser] = useState(null);
  const [gruposSugeridos, setGruposSugeridos] = useState([]);
  const [misGrupos, setMisGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningGroup, setJoiningGroup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        
        try {
          // Cargar preferencias del usuario y grupos actuales
          const userRef = doc(db, "users", u.uid);
          const userSnap = await getDoc(userRef);
          
          let userPrefs = {};
          let currentGroups = [];
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            userPrefs = userData.preferences || {};
            currentGroups = userData.myGroups || [];
            setMisGrupos(currentGroups);
          }
          
          // Obtener grupos sugeridos
          const grupos = getSuggestedGroups(userPrefs);
          
          // Filtrar grupos a los que ya se unió el usuario
          const gruposDisponibles = grupos.filter(grupo => 
            !currentGroups.some(miGrupo => miGrupo.id === grupo.id)
          );
          
          setGruposSugeridos(gruposDisponibles);
          setLoading(false);
        } catch (error) {
          console.error("Error al cargar datos:", error);
          setLoading(false);
        }
      } else {
        navigate("/login");
      }
    });
    
    return () => unsubAuth();
  }, [navigate]);

  const handleJoinGroup = async (grupo) => {
    if (!user || joiningGroup) return;
    
    setJoiningGroup(grupo.id);
    
    try {
      const result = await joinGroup(user.uid, grupo);
      
      if (result.success) {
        alert(result.message);
        
        // Actualizar la lista local para remover el grupo de sugeridos
        setGruposSugeridos(prev => prev.filter(g => g.id !== grupo.id));
        setMisGrupos(prev => [...prev, {
          id: grupo.id,
          nombre: grupo.nombre,
          descripcion: grupo.descripcion,
          joinedAt: new Date().toISOString()
        }]);
        
        // Opcional: navegar directamente al chat del grupo
        const goToChat = window.confirm("¿Quieres ir al chat del grupo ahora?");
        if (goToChat) {
          navigate(`/chat/${grupo.id}`); // RUTA CORREGIDA
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al unirse al grupo");
    } finally {
      setJoiningGroup(null);
    }
  };

  const handleGoToChat = (grupoId) => {
    navigate(`/chat/${grupoId}`); // RUTA CORREGIDA
  };

  if (loading) {
    return (
      <>
        <NavBar activePage="grupos" />
        <div className="loading-container">
          <BookLoader />
          <p>Cargando grupos...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar activePage="grupos" />
      <div className="explorar-grupos-container">
        <h2 className="titulo-principal">Explorar Grupos de Lectura</h2>
        
        {gruposSugeridos.length === 0 ? (
          <div className="no-grupos-mensaje">
            <p>¡Ya formas parte de todos los grupos disponibles!</p>
            <button 
              className="btn-mis-grupos"
              onClick={() => navigate("/mis-grupos")}
            >
              Ver mis grupos
            </button>
          </div>
        ) : (
          <>
            <p className="subtitulo">Grupos recomendados para ti:</p>
            <div className="grupos-grid">
              {gruposSugeridos.map((grupo) => (
                <div key={grupo.id} className="grupo-card">
                  <div className="grupo-avatar">
                    {grupo.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="grupo-info">
                    <h3 className="grupo-nombre">{grupo.nombre}</h3>
                    <p className="grupo-descripcion">{grupo.descripcion}</p>
                  </div>
                  <div className="grupo-botones">
                    <button
                      className="btn-unirse"
                      onClick={() => handleJoinGroup(grupo)}
                      disabled={joiningGroup === grupo.id}
                    >
                      {joiningGroup === grupo.id ? "Uniéndose..." : "Unirse"}
                    </button>
                    <button
                      className="btn-preview"
                      onClick={() => handleGoToChat(grupo.id)}
                      title="Ver chat (puedes leer sin unirte)"
                    >
                      Vista previa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        <div className="navegacion-botones">
          <button 
            className="btn-mis-grupos"
            onClick={() => navigate("/mis-grupos")}
          >
            Ver mis grupos ({misGrupos.length})
          </button>
        </div>
      </div>
    </>
  );
};

export default ExplorarGrupos;