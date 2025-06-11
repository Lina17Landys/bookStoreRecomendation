import EditarPerfil from '../../components/EditarPerfil/EditarPerfil';
import Usuario from '../../components/Usuario/Usuario';
import "./editPerfil.css"

const EditarPerfilPage = () => {
  return (
    <div>
      <Usuario/>
      <div className='contenedorEditar'>
        <EditarPerfil />
      </div>
    </div>
  );
};

export default EditarPerfilPage; 