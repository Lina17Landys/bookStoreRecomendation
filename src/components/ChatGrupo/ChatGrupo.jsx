import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../services/firebaseConfig";
import { leaveGroup } from "../../utils/groupUtils"; // IMPORTAR FUNCIÓN
import NavBar from "../NavBar/NavBar";
import BookLoader from "../BookLoader/BookLoader";
import "./ChatGrupo.css";

const ChatGrupo = () => {
  // OBTENER TANTO groupId COMO groupId de los parámetros
  const params = useParams();
  const groupId = params.groupId || params.groupId; // Manejar ambas rutas
  const navigate = useNavigate();
  const [grupo, setGrupo] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [error, setError] = useState(null);
  const [isUserInGroup, setIsUserInGroup] = useState(false);
  const mensajesEndRef = useRef(null);

  // DEBUG: Agregar logs para verificar parámetros
  useEffect(() => {
    console.log("Parámetros recibidos:", params);
    console.log("groupId extraído:", groupId);
  }, [params, groupId]);

  useEffect(() => {
    const auth = getAuth();
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
      } else {
        navigate("/login");
      }
    });
    return () => unsubAuth();
  }, [navigate]);

  useEffect(() => {
    if (!usuario || !groupId) return;

    const fetchOrCreateGroup = async () => {
      try {
        console.log("Buscando grupo con ID:", groupId);
        
        // Verificar si el usuario está en el grupo
        const userRef = doc(db, "users", usuario.uid);
        const userSnap = await getDoc(userRef);
        let userInGroup = false;
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          userInGroup = userData.myGroups?.some(g => g.id === groupId) || false;
        }
        setIsUserInGroup(userInGroup);
        
        const grupoRef = doc(db, "groupChats", groupId);
        const docSnap = await getDoc(grupoRef);
        
        if (docSnap.exists()) {
          console.log("Grupo encontrado:", docSnap.data());
          setGrupo(docSnap.data());
        } else {
          console.log("Grupo no existe, intentando crear uno por defecto...");
          
          // Grupos por defecto
          const gruposPorDefecto = {
            "magos-dragones": {
              nombre: "Magos y Dragones 🐉",
              descripcion: "Un club para los fans de mundos mágicos y criaturas míticas.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "corazones-literarios": {
              nombre: "Corazones Literarios 💕",
              descripcion: "Comparte novelas románticas que te hicieron suspirar.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "detectives-papel": {
              nombre: "Detectives del Papel 🔍",
              descripcion: "¿Quién fue el asesino? Averígualo con nosotros.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "lectores-futuro": {
              nombre: "Lectores del Futuro 🚀",
              descripcion: "Explora otros mundos y futuros posibles.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "noche-oscura": {
              nombre: "Noche de Lectura Oscura 👻",
              descripcion: "Comparte tus historias más escalofriantes.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "murakami-cafe": {
              nombre: "Murakami & Café ☕",
              descripcion: "Comparte tus lecturas y teorías sobre Haruki Murakami.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "cien-lecturas": {
              nombre: "Cien Lecturas de Soledad 🌾",
              descripcion: "Discute el realismo mágico y la obra de Gabo.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "hogwarts": {
              nombre: "Expreso a Hogwarts 🧙‍♂️",
              descripcion: "Revivamos la magia de Harry Potter juntos.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "1984": {
              nombre: "1984 y Más Allá 👁️",
              descripcion: "Hablemos de distopías y control social.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "lectores-nocturnos": {
              nombre: "Lectores nocturnos 🌙",
              descripcion: "Si lees hasta las 3am, este grupo es para ti.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "libros-tristes": {
              nombre: "Club de los Libros Tristes 😢",
              descripcion: "Historias que nos rompieron el corazón.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "viajeros-pagina": {
              nombre: "Viajeros de Página ✈️",
              descripcion: "Literatura de otros países y culturas.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "club-minimalista": {
              nombre: "Club Minimalista 📖✨",
              descripcion: "Recomendamos libros cortos pero poderosos.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "libros-cafe": {
              nombre: "Libros con Café ☕📚",
              descripcion: "Perfecto para leer y charlar con una taza caliente.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "comics-graficas": {
              nombre: "Cómics y Novelas Gráficas 🎨",
              descripcion: "Para quienes aman el arte en cada página.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "filosofia-todos": {
              nombre: "Filosofía para Todos 🧠",
              descripcion: "Discutamos ideas que desafían la mente.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "juventud-lectora": {
              nombre: "Juventud Lectora 👩‍🎓",
              descripcion: "Espacio para lectores entre 15 y 25 años.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "mamas-leen": {
              nombre: "Mamás que Leen 👩‍👧‍👦",
              descripcion: "Historias para compartir entre crianza y descanso.",
              integrantes: [],
              createdAt: serverTimestamp(),
            },
            "primera-lectura": {
              nombre: "Primera Lectura 📘",
              descripcion: "Grupo para quienes están retomando el hábito de leer.",
              integrantes: [],
              createdAt: serverTimestamp(),
            }
          };

          if (gruposPorDefecto[groupId]) {
            console.log("Creando grupo por defecto:", gruposPorDefecto[groupId]);
            await setDoc(grupoRef, gruposPorDefecto[groupId]);
            setGrupo(gruposPorDefecto[groupId]);
          } else {
            setError("Grupo no encontrado");
            console.error("ID de grupo no válido:", groupId);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener grupo:", error);
        setError("Error al cargar el grupo");
        setLoading(false);
      }
    };

    fetchOrCreateGroup();

    // Configurar listener para mensajes
    const mensajesRef = collection(db, "groupChats", groupId, "messages");
    const q = query(mensajesRef, orderBy("createdAt"));
    const unsubMsgs = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMensajes(msgs);
    });

    return () => unsubMsgs();
  }, [groupId, usuario, navigate]);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const handleEnviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    try {
      const mensajesRef = collection(db, "groupChats", groupId, "messages");
      await addDoc(mensajesRef, {
        text: nuevoMensaje.trim(),
        senderId: usuario.uid,
        senderName: usuario.displayName || usuario.email || "Anónimo",
        createdAt: serverTimestamp(),
      });

      setNuevoMensaje("");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("Error al enviar el mensaje");
    }
  };

  const salirDelGrupo = async () => {
    if (!usuario) return;
    
    // Confirmar antes de salir
    const confirmar = window.confirm("¿Estás seguro de que quieres salir de este grupo?");
    if (!confirmar) return;
    
    try {
      const result = await leaveGroup(usuario.uid, groupId);
      
      if (result.success) {
        alert(result.message);
        setIsUserInGroup(false);
        navigate("/mis-grupos");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error al salir del grupo:", error);
      alert("Error al salir del grupo");
    }
  };

  if (loading) {
    return (
      <div className="chat-loader">
        <BookLoader />
        <p>Cargando grupo...</p>
      </div>
    );
  }

  if (error || !grupo) {
    return (
      <>
        <NavBar activePage="grupos" />
        <div className="chatgrupo-container">
          <h1>Error</h1>
          <p>{error || "Grupo no encontrado"}</p>
          <p>Debug ID: {groupId || "Sin ID"}</p>
          <button className="btn-volver" onClick={() => navigate("/mis-grupos")}>
            Volver a Mis Grupos
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar activePage="grupos" />
      <div className="chatgrupo-container">
        <h1 className="chatgrupo-titulo">{grupo.nombre}</h1>
        <p className="chatgrupo-descripcion">{grupo.descripcion}</p>

        <h2>Integrantes</h2>
        <ul className="chatgrupo-integrantes">
          {grupo.integrantes && grupo.integrantes.length > 0 ? (
            grupo.integrantes.map((integrante, i) => (
              <li key={`${integrante}-${i}`}>{integrante}</li>
            ))
          ) : (
            <li>No hay integrantes registrados</li>
          )}
        </ul>

        <div className="chat-mensajes">
          {mensajes.length === 0 && <p>No hay mensajes aún. ¡Empieza la conversación!</p>}
          {mensajes.map((msg) => (
            <div
              key={msg.id}
              className={`mensaje ${msg.senderId === usuario.uid ? "mensaje-mio" : "mensaje-otro"}`}
            >
              <strong>{msg.senderName}:</strong> {msg.text}
            </div>
          ))}
          <div ref={mensajesEndRef} />
        </div>

        {/* Solo mostrar el formulario si el usuario está en el grupo */}
        {isUserInGroup ? (
          <form className="chat-form" onSubmit={handleEnviarMensaje}>
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
            />
            <button type="submit" disabled={!nuevoMensaje.trim()}>
              Enviar
            </button>
          </form>
        ) : (
          <div className="chat-form">
            <p>Únete al grupo para participar en la conversación</p>
            <button onClick={() => navigate("/explorar-grupos")}>
              Explorar Grupos
            </button>
          </div>
        )}

        <div className="chatgrupo-botones">
          <button className="btn-volver" onClick={() => navigate("/mis-grupos")}>
            Volver
          </button>
          {isUserInGroup && (
            <button className="btn-salir" onClick={salirDelGrupo}>
              Salir del grupo
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatGrupo;