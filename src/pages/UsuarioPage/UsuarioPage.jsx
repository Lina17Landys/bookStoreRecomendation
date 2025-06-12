import React, { useEffect, useState } from 'react';
import { auth, db } from '../../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import NavBar from '../../components/NavBar/NavBar';
import PerfilUsuario from '../../components/usuarioSection/usuarioSection';
import RecomendacionesLibros from '../../components/libroRecomendado/RecomendacionesLibros';
import FooterPerfil from '../../components/footerPerfil/footerPerfil';
import BookLoader from '../../components/BookLoader/BookLoader'; // importa tu loader
import './userPage.css';

const UsuarioPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const data = userDoc.data();

          setUserData({
            displayName: user.displayName || '',
            username: data?.username || '',
            descripcion: data?.descripcion || '',
            photoURL: user.photoURL || data?.photoURL || '',
            books: data?.books || [],
            groups: data?.groups || [],
            friends: data?.friends || []
          });
        } catch (error) {
          console.error('Error cargando datos de usuario:', error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <BookLoader />;  // Aquí el loader visual

  if (!userData) return <p className="no-user">Usuario no autenticado</p>;

  return (
    <>
      <NavBar activePage="usuario" />
      <div className="usuarioContainer">
        <div className="leftSidebar">
          <div style={{ flexGrow: 1 }}></div>
          <FooterPerfil />
        </div>

        <div className="containerUser">
          <PerfilUsuario user={userData} />
          <div className="separador" />
          <RecomendacionesLibros username={userData.username} libros={userData.books} />
        </div>
      </div>
    </>
  );
};

export default UsuarioPage;
