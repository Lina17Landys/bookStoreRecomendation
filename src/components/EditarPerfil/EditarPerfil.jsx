import React from 'react';
import './EditarPerfil.css';

const EditarPerfil = () => {
  return (
    <div id="editarperfil-container">
      <h1>Editar perfil</h1>
      <div className="tabs">
        <span className="active-tab">Perfil</span>
        <span>Contraseña</span>
      </div>

      <hr />

      <div className="form-section">
        <div className="profile-picture">
        <img src="./src/assets/img/fotoPerfil.svg" alt="Perfil" />
        <span className="cambiar-foto">Cambiar foto de perfil</span>
        </div>

        <form>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" value="Maria Paula Ortiz" disabled />
            <p className="help-text">
              Para ayudar a las personas a descubrir tu cuenta, utiliza el nombre por el que te conocen...
            </p>
          </div>

          <div className="form-group">
            <label>Nombre de usuario</label>
            <input type="text" value="paulisortize" />
            <p className="help-text">
              En la mayoría de los casos, podrás volver a cambiar tu nombre de usuario...
            </p>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea disabled value="Mujer de la sucursal del cielo..."></textarea>
          </div>

          <h3>Información personal</h3>
          <p className="help-text">
            Proporciona tu información personal, incluso si es una cuenta de negocio...
          </p>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value="mportize@gmail.com" />
          </div>

          <div className="form-group">
            <label>Celular</label>
            <input type="tel" placeholder="123 456 76 89" />
          </div>

          <button className="btn guardar-naranja">Guardar cambios</button>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfil;
