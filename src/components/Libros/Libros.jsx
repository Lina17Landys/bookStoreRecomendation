// src/components/Libros/Libros.js
import React, { useEffect, useState } from 'react';
import './Libros.css';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../services/firebaseConfig';
import NavBar from '../NavBar/NavBar';
import BookLoader from '../BookLoader/BookLoader';
import { FaStar, FaRegStar, FaHeart, FaRegHeart, FaTrashAlt, FaCheckCircle, FaBookOpen } from 'react-icons/fa';

const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.uid) {
      setCargando(false);
      setLibros([]);
      return;
    }

    setCargando(true);
    const ref = doc(db, 'users', user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setLibros(data.myBooks || []);
      } else {
        setLibros([]);
      }
      setCargando(false);
    }, () => setCargando(false));

    return () => unsub();
  }, [user?.uid, authLoading]);

  const toggleLeido = async (index) => {
    if (!user) return;
    const nuevosLibros = [...libros];
    nuevosLibros[index].leido = !nuevosLibros[index].leido;
    await updateDoc(doc(db, 'users', user.uid), { myBooks: nuevosLibros });
  };

  const toggleRecomendado = async (index) => {
    if (!user) return;
    const nuevosLibros = [...libros];
    nuevosLibros[index].recomendado = !(nuevosLibros[index].recomendado || false);
    await updateDoc(doc(db, 'users', user.uid), { myBooks: nuevosLibros });
  };

  const cambiarRating = async (index, nuevoRating) => {
    if (!user) return;
    const nuevosLibros = [...libros];
    nuevosLibros[index].rating = nuevoRating;
    await updateDoc(doc(db, 'users', user.uid), { myBooks: nuevosLibros });
  };

  const eliminarLibro = async (index) => {
    if (!user) return;
    const nuevosLibros = libros.filter((_, i) => i !== index);
    await updateDoc(doc(db, 'users', user.uid), { myBooks: nuevosLibros });
  };

  const librosLeidos = libros.filter((libro) => libro.leido === true);
  const librosPendientes = libros.filter((libro) => libro.leido !== true);
  const librosRecomendados = libros.filter((libro) => libro.recomendado === true);
  const librosRankeados = libros
    .filter((libro) => libro.rating && libro.rating > 0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <>
      <NavBar activePage="mis-libros" />
      <div className="libros-container">
        <h1 className="titulo-principal">Mis libros</h1>

        {authLoading || cargando ? (
          <BookLoader />
        ) : !user ? (
          <div className="mensaje-vacio">
            Debes iniciar sesión para ver tus libros.
          </div>
        ) : libros.length === 0 ? (
          <div className="mensaje-vacio">
            Aún no has agregado libros.
          </div>
        ) : (
          <>
            <div className="seccion-libros">
              <h2 className="titulo-seccion">📚 Todos mis libros ({libros.length})</h2>
              <div className="libros-grid">
                {libros.map((libro, index) => (
                  <LibroCard
                    key={`todos-${index}`}
                    libro={libro}
                    index={index}
                    toggleLeido={toggleLeido}
                    toggleRecomendado={toggleRecomendado}
                    cambiarRating={cambiarRating}
                    eliminarLibro={eliminarLibro}
                  />
                ))}
              </div>
            </div>

            {librosPendientes.length > 0 && (
              <div className="seccion-libros">
                <h2 className="titulo-seccion"><FaBookOpen /> Pendientes por leer ({librosPendientes.length})</h2>
                <div className="libros-grid">
                  {librosPendientes.map((libro, index) => (
                    <LibroCard
                      key={`pendiente-${index}`}
                      libro={libro}
                      index={libros.findIndex(l => l === libro)}
                      toggleLeido={toggleLeido}
                      toggleRecomendado={toggleRecomendado}
                      cambiarRating={cambiarRating}
                      eliminarLibro={eliminarLibro}
                    />
                  ))}
                </div>
              </div>
            )}

            {librosLeidos.length > 0 && (
              <div className="seccion-libros">
                <h2 className="titulo-seccion"><FaCheckCircle color="green" /> Ya leídos ({librosLeidos.length})</h2>
                <div className="libros-grid">
                  {librosLeidos.map((libro, index) => (
                    <LibroCard
                      key={`leido-${index}`}
                      libro={libro}
                      index={libros.findIndex(l => l === libro)}
                      toggleLeido={toggleLeido}
                      toggleRecomendado={toggleRecomendado}
                      cambiarRating={cambiarRating}
                      eliminarLibro={eliminarLibro}
                    />
                  ))}
                </div>
              </div>
            )}

            {librosRecomendados.length > 0 && (
              <div className="seccion-libros">
                <h2 className="titulo-seccion"><FaHeart color="red" /> Mis Recomendaciones ({librosRecomendados.length})</h2>
                <div className="libros-grid">
                  {librosRecomendados.map((libro, index) => (
                    <LibroCard
                      key={`recomendado-${index}`}
                      libro={libro}
                      index={libros.findIndex(l => l === libro)}
                      toggleLeido={toggleLeido}
                      toggleRecomendado={toggleRecomendado}
                      cambiarRating={cambiarRating}
                      eliminarLibro={eliminarLibro}
                      mostrarRecomendado={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {librosRankeados.length > 0 && (
              <div className="seccion-libros">
                <h2 className="titulo-seccion">⭐ Mejor Valorados ({librosRankeados.length})</h2>
                <div className="libros-grid">
                  {librosRankeados.slice(0, 5).map((libro, index) => (
                    <LibroCard
                      key={`ranking-${index}`}
                      libro={libro}
                      index={libros.findIndex(l => l === libro)}
                      toggleLeido={toggleLeido}
                      toggleRecomendado={toggleRecomendado}
                      cambiarRating={cambiarRating}
                      eliminarLibro={eliminarLibro}
                      mostrarRanking={true}
                      posicionRanking={index + 1}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

const LibroCard = ({
  libro,
  index,
  toggleLeido,
  toggleRecomendado,
  cambiarRating,
  eliminarLibro,
  mostrarRecomendado = false,
  mostrarRanking = false,
  posicionRanking = null
}) => (
  <div className="libro-card">
    {mostrarRanking && posicionRanking && (
      <div className="ranking-badge">#{posicionRanking}</div>
    )}

    <div className="libro-info">
      <div className="libro-titulo">
        <strong>{libro.titulo}</strong>
      </div>
      <div className="libro-autor">{libro.autor}</div>

      <div className="rating-container" aria-label={`Rating: ${libro.rating || 0} de 5 estrellas`}>
        <span className="rating-label">Valoración:</span>
        <div className="estrellas">
          {[1, 2, 3, 4, 5].map((estrella) =>
            (libro.rating || 0) >= estrella ? (
              <FaStar
                key={estrella}
                className="estrella-activa"
                onClick={() => cambiarRating(index, estrella)}
                style={{ cursor: 'pointer', color: '#FFD700' }}
                aria-label={`${estrella} estrella`}
                role="button"
              />
            ) : (
              <FaRegStar
                key={estrella}
                className="estrella-inactiva"
                onClick={() => cambiarRating(index, estrella)}
                style={{ cursor: 'pointer', color: '#bbb' }}
                aria-label={`${estrella} estrella`}
                role="button"
              />
            )
          )}
        </div>
      </div>
    </div>

    <div className="libro-acciones">
      <button
        onClick={() => toggleLeido(index)}
        className={`btn-leido-toggle ${libro.leido ? 'activo' : ''}`}
        aria-pressed={libro.leido}
        title={libro.leido ? 'Marcar como no leído' : 'Marcar como leído'}
      >
        {libro.leido ? <FaCheckCircle color="white" /> : <FaBookOpen />}
        &nbsp; {libro.leido ? 'Leído' : 'Marcar como leído'}
      </button>

      <button
        onClick={() => toggleRecomendado(index)}
        className={`btn-recomendado-toggle ${libro.recomendado ? 'activo' : ''}`}
        aria-pressed={libro.recomendado}
        title={libro.recomendado ? 'Quitar recomendación' : 'Recomendar libro'}
      >
        {libro.recomendado ? <FaHeart color="white" /> : <FaRegHeart />}
        &nbsp; {libro.recomendado ? 'Recomendado' : 'Recomendar'}
      </button>

      <button
        onClick={() => eliminarLibro(index)}
        className="btn-eliminar"
        title="Eliminar libro"
        aria-label={`Eliminar libro ${libro.titulo}`}
      >
        <FaTrashAlt />
      </button>
    </div>
  </div>
);

export default Libros;
