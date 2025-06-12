import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../services/firebaseConfig';
import { getSuggestedGroups } from "../../utils/groupSuggestion";
import NavBar from '../NavBar/NavBar';
import BookLoader from '../BookLoader/BookLoader';
import './Buscar.css';

const Buscar = () => {
  const [searchParams] = useSearchParams();
  const [user] = useAuthState(auth);
  const [resultados, setResultados] = useState({
    libros: [],
    usuarios: [],
    grupos: []
  });
  const [cargando, setCargando] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [agregandoLibro, setAgregandoLibro] = useState({});
  const [uniendoGrupo, setUniendoGrupo] = useState({});
  const [agregandoAmigo, setAgregandoAmigo] = useState({});

  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      setTerminoBusqueda(query);
      buscar(query);
    }
  }, [searchParams]);

  const buscarLibrosOpenLibrary = async (termino) => {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(termino)}&limit=20`
      );
      const data = await response.json();
      
      return data.docs?.map(libro => ({
        key: libro.key,
        titulo: libro.title || 'Título no disponible',
        autor: libro.author_name ? libro.author_name.join(', ') : 'Autor desconocido',
        isbn: libro.isbn ? libro.isbn[0] : null,
        cover_id: libro.cover_i,
        first_publish_year: libro.first_publish_year,
        publisher: libro.publisher ? libro.publisher[0] : null,
        language: libro.language ? libro.language[0] : null,
        pages: libro.number_of_pages_median,
        subjects: libro.subject ? libro.subject.slice(0, 5) : [],
        cover_url: libro.cover_i 
          ? `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`
          : null,
        openlibrary_url: `https://openlibrary.org${libro.key}`,
        type: 'openlibrary'
      })) || [];
    } catch (error) {
      console.error('Error buscando en OpenLibrary:', error);
      return [];
    }
  };

  const buscar = async (termino) => {
    if (!termino.trim()) return;
    
    setCargando(true);
    try {
      const [usuariosSnapshot, gruposSugeridos, librosOpenLibrary] = await Promise.all([
        getDocs(collection(db, 'users')),
        getSuggestedGroups(termino),
        buscarLibrosOpenLibrary(termino)
      ]);

      // Buscar en usuarios - mejorada la búsqueda
      const usuarios = [];
      usuariosSnapshot.forEach((doc) => {
        const data = doc.data();
        // No incluir al usuario actual en los resultados
        if (doc.id === user?.uid) return;
        
        const nombre = data.nombre || data.displayName || data.name || '';
        const email = data.email || '';
        const username = data.username || '';
        
        // Búsqueda más amplia en diferentes campos
        const terminoLower = termino.toLowerCase();
        if (nombre.toLowerCase().includes(terminoLower) || 
            email.toLowerCase().includes(terminoLower) ||
            username.toLowerCase().includes(terminoLower)) {
          usuarios.push({
            id: doc.id,
            nombre: nombre || email.split('@')[0] || 'Usuario',
            photoURL: data.photoURL || data.avatar || '',
            email: email,
            username: username,
            librosCount: data.myBooks?.length || 0
          });
        }
      });

      // Buscar libros en bibliotecas de usuarios
      const librosUsuarios = [];
      usuariosSnapshot.forEach((doc) => {
        const data = doc.data();
        const myBooks = data.myBooks || [];
        myBooks.forEach((libro) => {
          if (libro.titulo?.toLowerCase().includes(termino.toLowerCase()) ||
              libro.autor?.toLowerCase().includes(termino.toLowerCase())) {
            librosUsuarios.push({
              ...libro,
              propietario: data.nombre || data.displayName || 'Usuario',
              propietarioId: doc.id,
              type: 'usuario'
            });
          }
        });
      });

      // Combinar libros
      const todosLosLibros = [
        ...librosUsuarios,
        ...librosOpenLibrary
      ];

      // Filtrar grupos
      const gruposFiltrados = gruposSugeridos.filter(grupo =>
        grupo.nombre?.toLowerCase().includes(termino.toLowerCase()) ||
        grupo.descripcion?.toLowerCase().includes(termino.toLowerCase()) ||
        grupo.tags?.some(tag => tag.toLowerCase().includes(termino.toLowerCase()))
      );

      setResultados({ 
        libros: todosLosLibros, 
        usuarios, 
        grupos: gruposFiltrados 
      });
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    } finally {
      setCargando(false);
    }
  };

  const agregarLibro = async (libro) => {
    if (!user) return;
    
    const libroKey = libro.key || `${libro.titulo}-${libro.autor}`;
    setAgregandoLibro(prev => ({ ...prev, [libroKey]: true }));
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const myBooks = userData.myBooks || [];
        
        // Verificar si el libro ya existe
        const libroExiste = myBooks.some(book => 
          book.titulo === libro.titulo && book.autor === libro.autor
        );
        
        if (!libroExiste) {
          const nuevoLibro = {
            titulo: libro.titulo,
            autor: libro.autor,
            isbn: libro.isbn,
            cover_url: libro.cover_url,
            first_publish_year: libro.first_publish_year,
            publisher: libro.publisher,
            pages: libro.pages,
            subjects: libro.subjects || [],
            agregado: new Date().toISOString(),
            estado: 'quiero_leer'
          };
          
          await updateDoc(userRef, {
            myBooks: arrayUnion(nuevoLibro)
          });
          
          console.log('Libro agregado exitosamente');
        } else {
          console.log('El libro ya está en tu biblioteca');
        }
      }
    } catch (error) {
      console.error('Error al agregar libro:', error);
    } finally {
      setAgregandoLibro(prev => ({ ...prev, [libroKey]: false }));
    }
  };

  const unirseAGrupo = async (grupo) => {
    if (!user) return;
    
    setUniendoGrupo(prev => ({ ...prev, [grupo.id]: true }));
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const misGrupos = userData.grupos || [];
        
        // Verificar si ya está en el grupo
        const yaEnGrupo = misGrupos.some(g => g.id === grupo.id);
        
        if (!yaEnGrupo) {
          const nuevoGrupo = {
            id: grupo.id,
            nombre: grupo.nombre,
            categoria: grupo.categoria,
            categoria_emoji: grupo.categoria_emoji,
            descripcion: grupo.descripcion,
            tags: grupo.tags,
            fecha_union: new Date().toISOString()
          };
          
          await updateDoc(userRef, {
            grupos: arrayUnion(nuevoGrupo)
          });
          
          console.log('Te has unido al grupo exitosamente');
        } else {
          console.log('Ya perteneces a este grupo');
        }
      }
    } catch (error) {
      console.error('Error al unirse al grupo:', error);
    } finally {
      setUniendoGrupo(prev => ({ ...prev, [grupo.id]: false }));
    }
  };

  const agregarAmigo = async (usuario) => {
    if (!user) return;
    
    setAgregandoAmigo(prev => ({ ...prev, [usuario.id]: true }));
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const amigos = userData.amigos || [];
        
        // Verificar si ya son amigos
        const yaAmigos = amigos.some(amigo => amigo.id === usuario.id);
        
        if (!yaAmigos) {
          const nuevoAmigo = {
            id: usuario.id,
            nombre: usuario.nombre,
            photoURL: usuario.photoURL,
            email: usuario.email,
            username: usuario.username,
            fecha_amistad: new Date().toISOString()
          };
          
          await updateDoc(userRef, {
            amigos: arrayUnion(nuevoAmigo)
          });
          
          console.log('Amigo agregado exitosamente');
        } else {
          console.log('Ya son amigos');
        }
      }
    } catch (error) {
      console.error('Error al agregar amigo:', error);
    } finally {
      setAgregandoAmigo(prev => ({ ...prev, [usuario.id]: false }));
    }
  };

  // Componente para libros con botón simple
  const ResultadoLibro = ({ libro }) => {
    const libroKey = libro.key || `${libro.titulo}-${libro.autor}`;
    const agregando = agregandoLibro[libroKey];
    
    return (
      <div className="libro-card">
        <div className="libro-cover">
          {libro.cover_url ? (
            <img src={libro.cover_url} alt={libro.titulo} />
          ) : (
            <div className="cover-placeholder">📚</div>
          )}
        </div>
        <div className="libro-info">
          <h4 className="libro-titulo">{libro.titulo}</h4>
          <p className="libro-autor">{libro.autor}</p>
          <div className="libro-actions">
            <button 
              className={`btn-agregar-libro ${agregando ? 'agregando' : ''}`}
              onClick={() => agregarLibro(libro)}
              disabled={agregando || !user}
            >
              {agregando ? (
                <>
                  <span className="spinner-small"></span>
                  Agregando...
                </>
              ) : (
                'Agregar a mis libros'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ResultadoUsuario = ({ usuario }) => {
    const agregando = agregandoAmigo[usuario.id];
    
    return (
      <div className="usuario-card">
        <div className="usuario-avatar">
          {usuario.photoURL ? (
            <img src={usuario.photoURL} alt={usuario.nombre} />
          ) : (
            <div className="avatar-inicial">
              {usuario.nombre.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="usuario-info">
          <h4>{usuario.nombre}</h4>
          {usuario.username && <p className="username">@{usuario.username}</p>}
          <p className="email">{usuario.email}</p>
          <small className="libros-count">📚 {usuario.librosCount} libros</small>
          <div className="usuario-actions">
            <button 
              className={`btn-agregar-amigo ${agregando ? 'agregando' : ''}`}
              onClick={() => agregarAmigo(usuario)}
              disabled={agregando || !user}
            >
              {agregando ? (
                <>
                  <span className="spinner-small"></span>
                  Agregando...
                </>
              ) : (
                'Agregar amigo'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ResultadoGrupo = ({ grupo }) => {
    const uniendo = uniendoGrupo[grupo.id];
    
    return (
      <div className="grupo-card">
        <div className="grupo-icon">
          <span className="categoria-emoji">{grupo.categoria_emoji || '👥'}</span>
        </div>
        <div className="grupo-info">
          <h4>{grupo.nombre}</h4>
          <p className="descripcion">{grupo.descripcion}</p>
          <div className="grupo-meta">
            <small className="categoria">🏷️ {grupo.categoria}</small>
            {grupo.tags && grupo.tags.length > 0 && (
              <div className="tags">
                {grupo.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
          <div className="grupo-actions">
            <button 
              className={`btn-unirse-grupo ${uniendo ? 'uniendo' : ''}`}
              onClick={() => unirseAGrupo(grupo)}
              disabled={uniendo || !user}
            >
              {uniendo ? (
                <>
                  <span className="spinner-small"></span>
                  Uniéndose...
                </>
              ) : (
                '+ Unirse al grupo'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <NavBar />
      <div className="buscar-container">
        <h1>Resultados para: "{terminoBusqueda}"</h1>
        
        {cargando ? (
          <div className="cargando">
            <BookLoader />
            <p>Buscando en libros, usuarios y grupos...</p>
          </div>
        ) : (
          <>
            {/* Libros */}
            {resultados.libros.length > 0 && (
              <section className="seccion-resultados">
                <h2>Libros ({resultados.libros.length})</h2>
                <div className="libros-grid">
                  {resultados.libros.map((libro, index) => (
                    <ResultadoLibro key={libro.key || `${libro.titulo}-${index}`} libro={libro} />
                  ))}
                </div>
              </section>
            )}

            {/* Usuarios */}
            {resultados.usuarios.length > 0 && (
              <section className="seccion-resultados">
                <h2>Usuarios ({resultados.usuarios.length})</h2>
                <div className="usuarios-grid">
                  {resultados.usuarios.map((usuario) => (
                    <ResultadoUsuario key={usuario.id} usuario={usuario} />
                  ))}
                </div>
              </section>
            )}

            {/* Grupos */}
            {resultados.grupos.length > 0 && (
              <section className="seccion-resultados">
                <h2>Grupos Sugeridos ({resultados.grupos.length})</h2>
                <div className="grupos-grid">
                  {resultados.grupos.map((grupo, index) => (
                    <ResultadoGrupo key={grupo.id || index} grupo={grupo} />
                  ))}
                </div>
              </section>
            )}

            {/* Sin resultados */}
            {!cargando && 
             resultados.libros.length === 0 && 
             resultados.usuarios.length === 0 && 
             resultados.grupos.length === 0 && 
             terminoBusqueda && (
              <div className="sin-resultados">
                <div className="sin-resultados-icon">🔍</div>
                <h3>No se encontraron resultados</h3>
                <p>No se encontraron resultados para "{terminoBusqueda}"</p>
                <div className="sugerencias">
                  <h4>Sugerencias:</h4>
                  <ul>
                    <li>Verifica la ortografía</li>             
                    <li>Intenta con términos más generales</li>
                    <li>Busca por título, autor, usuario o tema</li>
                    <li>Usa palabras clave específicas</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Buscar;