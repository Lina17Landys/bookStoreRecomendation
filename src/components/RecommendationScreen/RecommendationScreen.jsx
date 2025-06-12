import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserPreferences, addBookToUser } from "../../utils/firebaseHelpers";
import NavBar from "../NavBar/NavBar";
import BookLoader from "../BookLoader/BookLoader";
import { getSuggestedGroups } from "../../utils/groupSuggestion";
import "./RecommendationScreen.css";
import { FaTelegramPlane } from "react-icons/fa";
import { addGroupToUser } from "../../utils/firebaseHelpers";

const RecommendationScreen = () => {
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [misLibros, setMisLibros] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mostrarTodosGrupos, setMostrarTodosGrupos] = useState(false);
  const [misGrupos, setMisGrupos] = useState([]);
  
  const auth = getAuth();

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchRecomendaciones = async () => {
      // Esperar a que termine la verificación de auth
      if (authLoading) return;
      
      // Si no hay usuario después de verificar auth
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const prefs = await getUserPreferences(user.uid);
        if (!prefs) {
          setLoading(false);
          return;
        }

        setMisGrupos(prefs?.myGroups || []);

        const yaGuardados = prefs?.myBooks || [];
        setMisLibros(yaGuardados);

        const queryList = [
          ...(prefs.favoriteBooks || []),
          ...(prefs.favoriteGenres || []),
          ...(prefs.favoriteAuthors || []),
        ];

        const queries = queryList.slice(0, 5);

        if (queries.length === 0) {
          setLoading(false);
          return;
        }

        const results = await Promise.all(
          queries.map(async (q) => {
            try {
              const res = await fetch(
                `https://openlibrary.org/search.json?q=${encodeURIComponent(
                  q
                )}&limit=1`
              );
              
              if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
              }
              
              const data = await res.json();
              const book = data.docs[0];
              return book && book.cover_i
                ? {
                    titulo: book.title,
                    autor: book.author_name?.[0],
                    imagen: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
                  }
                : null;
            } catch (error) {
              console.error(`Error fetching book for query "${q}":`, error);
              return null;
            }
          })
        );

        setRecomendaciones(results.filter(Boolean));

        // Usamos la "API" externa
        const gruposSugeridos = getSuggestedGroups(prefs);
        setGrupos(gruposSugeridos);
      } catch (error) {
        console.error("Error al generar recomendaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecomendaciones();
  }, [user, authLoading]);

  const handleAgregar = async (libro) => {
    if (!user) return alert("Debes iniciar sesión.");
    try {
      await addBookToUser(user.uid, libro);
      setMisLibros((prev) => [...prev, { ...libro, leido: false }]);
      
      // Actualizar grupos después de agregar libro
      const prefs = await getUserPreferences(user.uid);
      if (prefs) {
        const gruposSugeridos = getSuggestedGroups(prefs);
        setGrupos(gruposSugeridos);
      }
    } catch (error) {
      console.error("Error al agregar libro:", error);
      alert("Error al agregar el libro. Intenta de nuevo.");
    }
  };

  const handleUnirse = async (grupo) => {
    if (!user) return alert("Debes iniciar sesión.");
    try {
      await addGroupToUser(user.uid, grupo);
      setMisGrupos((prev) => [...prev, grupo]);
    } catch (error) {
      console.error("Error al unirse al grupo:", error);
      alert("Error al unirse al grupo. Intenta de nuevo.");
    }
  };

  // Mostrar loader mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="recommendation-container">
        <NavBar activePage="recomendacion" />
        <div className="loader-wrapper">
          <BookLoader />
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado
  if (!user) {
    return (
      <div className="recommendation-container">
        <NavBar activePage="recomendacion" />
        <div className="no-auth-message">
          <h2>Inicia sesión para ver tus recomendaciones</h2>
          <p>Necesitas estar autenticado para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendation-container">
      <NavBar activePage="recomendacion" />
      <h2 className="recommendation-title">
        Tus recomendaciones personalizadas
      </h2>

      {loading ? (
        <div className="loader-wrapper">
          <BookLoader />
        </div>
      ) : (
        <>
          {recomendaciones.length === 0 ? (
            <div className="no-recommendations">
              <p>No se encontraron recomendaciones. Completa tu perfil para obtener mejores sugerencias.</p>
            </div>
          ) : (
            <div className="recomendaciones-grid">
              {recomendaciones.map((libro, i) => (
                <div key={i} className="recomendacion-item">
                  <img src={libro.imagen} alt={libro.titulo} />
                  <h3>{libro.titulo}</h3>
                  <p>{libro.autor}</p>
                  <button
                    onClick={() => handleAgregar(libro)}
                    disabled={misLibros.some((l) => l.titulo === libro.titulo)}
                  >
                    {misLibros.some((l) => l.titulo === libro.titulo)
                      ? "Ya agregado"
                      : "Agregar a mis libros"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {grupos.length > 0 && (
            <div className="grupos-section">
              <h2>Grupos de lectura recomendados</h2>
              <div className="grupos-grid">
                {(mostrarTodosGrupos ? grupos : grupos.slice(0, 6)).map(
                  (g, i) => (
                    <div key={i} className="grupo-item">
                      <div className="grupo-avatar">{g.nombre.charAt(0)}</div>
                      <div className="grupo-info">
                        <strong>{g.nombre}</strong>
                        <p>{g.descripcion}</p>
                      </div>
                      <button
                        className="grupo-boton"
                        disabled={misGrupos.some((joined) => joined.nombre === g.nombre)}
                        onClick={() => handleUnirse(g)}
                      >
                        {misGrupos.some((joined) => joined.nombre === g.nombre)
                          ? "Ya unido"
                          : "Unirme"}
                      </button>
                    </div>
                  )
                )}
              </div>
              {grupos.length > 6 && (
                <div className="ver-mas-wrapper">
                  <button
                    className="ver-mas-boton"
                    onClick={() => setMostrarTodosGrupos((prev) => !prev)}
                  >
                    {mostrarTodosGrupos ? "Ver menos" : "Ver más"}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="cta-telegram">
            <h3>¿Quieres más recomendaciones?</h3>
            <p>
              Habla con nuestro bot de Telegram para obtener libros
              personalizados.
            </p>
            <a
              href="https://t.me/Imula_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-telegram"
            >
              Ir al bot de Telegram 📚
            </a>
          </div>

          <a
            href="https://t.me/Imula_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-telegram-floating"
            title="Ir al bot de Telegram"
          >
            <FaTelegramPlane size={24} />
          </a>
        </>
      )}
    </div>
  );
};

export default RecommendationScreen;