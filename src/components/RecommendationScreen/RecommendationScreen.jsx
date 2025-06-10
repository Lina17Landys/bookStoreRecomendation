import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getUserPreferences } from "../../utils/firebaseHelpers";
import { addBookToUser } from "../../utils/firebaseHelpers";
import "./RecommendationScreen.css";
import logo from "../../assets/logo.svg";

const RecommendationScreen = () => {
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchRecomendaciones = async () => {
      if (!user) return;

      try {
        const prefs = await getUserPreferences(user.uid);
        if (!prefs) return;

        const queryList = [
          ...(prefs.favoriteBooks || []),
          ...(prefs.favoriteGenres || []),
          ...(prefs.favoriteAuthors || []),
        ];

        // Limitar a 5 búsquedas para no saturar
        const queries = queryList.slice(0, 5);

        const results = await Promise.all(
          queries.map(async (q) => {
            const res = await fetch(
              `https://openlibrary.org/search.json?q=${encodeURIComponent(
                q
              )}&limit=1`
            );
            const data = await res.json();
            const book = data.docs[0];
            return book && book.cover_i
              ? {
                  titulo: book.title,
                  autor: book.author_name?.[0],
                  imagen: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
                }
              : null;
          })
        );

        const limpios = results.filter(Boolean);
        setRecomendaciones(limpios);
        setLoading(false);
      } catch (error) {
        console.error("Error al generar recomendaciones:", error);
      }
    };

    fetchRecomendaciones();
  }, [user]);

  const handleAgregar = async (libro) => {
    if (!user) return alert("Debes iniciar sesión.");
    try {
      await addBookToUser(user.uid, libro);
      alert("¡Libro agregado a tu perfil!");
    } catch (error) {
      console.error("Error al agregar libro:", error);
    }
  };

  return (
    <div className="recommendation-container">
      <header className="selection-header">
        <img src={logo} alt="Logo" className="selection-logo" />
        <nav className="selection-nav">
          <a href="/">Inicio</a>
          <a href="/mis-libros">Mis libros</a>
          <a href="/grupos">Grupos</a>
          <a href="/recomendacion" className="activo">
            Recomendación
          </a>
        </nav>
      </header>

      <h2 className="recommendation-title">
        Tus recomendaciones personalizadas
      </h2>

      {loading ? (
        <p>Cargando recomendaciones...</p>
      ) : (
        <div className="recomendaciones-grid">
          {recomendaciones.map((libro, i) => (
            <div key={i} className="recomendacion-item">
              <img src={libro.imagen} alt={libro.titulo} />
              <h3>{libro.titulo}</h3>
              <p>{libro.autor}</p>
              <button onClick={() => handleAgregar(libro)}>
                Agregar a mis libros
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationScreen;
