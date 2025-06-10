import Usuario from '../../components/Usuario/Usuario';
import PerfilUsuario from '../../components/usuarioSection/usuarioSection';
import RecomendacionesLibros from '../../components/libroRecomendado/RecomendacionesLibros';
import FooterPerfil from '../../components/footerPerfil/footerPerfil';
import "./userPage.css";

const UsuarioPage = () => {
  return (
    <>
      <Usuario />
      <div className="usuarioContainer">
        <div className="leftSidebar">
          <div style={{ flexGrow: 1 }}></div>
          <FooterPerfil />
        </div>


        <div className="containerUser">
          <PerfilUsuario />
          <RecomendacionesLibros />
        </div>
      </div>

    </>
  );
};

export default UsuarioPage;
