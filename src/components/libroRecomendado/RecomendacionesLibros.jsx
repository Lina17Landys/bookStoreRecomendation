import React, { useEffect, useState } from "react";
import "./RecomendacionesLibros.css";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";

const RecomendacionesLibros = () => {
  const [libros, setLibros] = useState([]);
  const [verTodos, setVerTodos] = useState(false);
  const user = getAuth().currentUser;

  useEffect(() => {
    if (!user?.uid) return;

    const userRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setLibros(data.myBooks || []);
      }
    });

    return () => unsub();
  }, [user?.uid]);

  const toggleLeido = async (index) => {
    if (!user) return;
    const newLibros = [...libros];
    newLibros[index].leido = !newLibros[index].leido;
    await updateDoc(doc(db, "users", user.uid), { myBooks: newLibros });
  };

  const eliminarLibro = async (index) => {
    if (!user) return;
    const newLibros = libros.filter((_, i) => i !== index);
    await updateDoc(doc(db, "users", user.uid), { myBooks: newLibros });
  };

  return (
    <div className="libros-recomendados-container">
      <div className="libros-header">
        <h3>{user?.displayName || "Usuario"} Libros</h3>
        {libros.length > 2 && (
          <button
            onClick={() => setVerTodos(!verTodos)}
            className="ver-mas"
          >
            {verTodos ? "Ver menos" : "Más"}
          </button>
        )}
      </div>

      {libros.length === 0 ? (
        <p className="sin-recomendaciones">
          Todavía no tienes libros agregados
        </p>
      ) : (
        <div className={`libros-grid ${verTodos ? "vertical" : "horizontal"}`}>
          {(verTodos ? libros : libros.slice(0, 3)).map((libro, index) => (
            <div className="libro-item" key={`${libro.titulo}-${index}`}>
              <img
                src={libro.imagen}
                alt={libro.titulo}
                className="libro-portada"
              />
              <p className="libro-titulo">
                <strong>{libro.titulo}</strong>
              </p>
              <p className="libro-autor">{libro.autor}</p>

              <div className="botones-libro">
                <button
                  onClick={() => toggleLeido(index)}
                  className={libro.leido ? "btn-leido" : "btn-no-leido"}
                >
                  {libro.leido ? "Leído" : "Marcar como leído"}
                </button>
                <button
                  onClick={() => eliminarLibro(index)}
                  className="btn-eliminar"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecomendacionesLibros;
