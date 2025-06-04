import Usuario from '../../components/Usuario/Usuario';
import PerfilUsuario from '../../components/usuarioSection/usuarioSection';
import RecomendacionesLibros from '../../components/libroRecomendado/RecomendacionesLibros';
import "./userPage.css"

const UsuarioPage = () => {
  return (
    <div>
      <Usuario />

      <PerfilUsuario />
      <RecomendacionesLibros/>
    </div>
  );
};

export default UsuarioPage;
