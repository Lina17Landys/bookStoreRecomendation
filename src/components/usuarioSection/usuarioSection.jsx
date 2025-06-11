import React from 'react';
import { Link } from 'react-router-dom';
import './PerfilSection.css';
import perfilFoto from '../../assets/img/fotoPerfil.svg'; 

const PerfilUsuario = () => {
  return (
    <div className="perfil-container">
      <img src={perfilFoto} alt="Foto de perfil" className="perfil-foto" />

      <div className="perfil-info">
        <div className="perfil-top">
          <h2 className="username">paulisortize</h2>
          <Link to="/editar-perfil" className="editar-btn">Editar perfil</Link>
        </div>

        <div className="estadisticas">
          <p><strong>20</strong> Libros</p>
          <p><strong>5</strong> Grupos</p>
          <p><strong>420</strong> Amigos</p>
        </div>

        <div className="descripcion">
          <p className="nombre-real">Maria Paula</p>
          <p className="bio">
            Mujer de la sucursal del cielo. Vida Amarilla. Melena de león. Piel canela.
            Bitácora de momentos. Adicta al arte. Una vida olor a café. Visual soul.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
