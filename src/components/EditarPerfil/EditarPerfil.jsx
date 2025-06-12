import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar"; // Ajusta según tu estructura
import { auth, db } from "../../services/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  updateProfile,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import "./EditarPerfil.css";

// Componente para mostrar inicial en círculo
function AvatarInicial({ nombre }) {
  const inicial = nombre ? nombre.charAt(0).toUpperCase() : "?";
  return (
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        backgroundColor: "#382110",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 72,
        fontWeight: "bold",
        userSelect: "none",
        marginBottom: 20,
      }}
    >
      {inicial}
    </div>
  );
}

const EditarPerfil = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("perfil");

  const [formData, setFormData] = useState({
    nombre: "",
    username: "",
    descripcion: "",
    email: "",
    celular: "",
    photoURL: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFormData({
            nombre: user.displayName || "",
            username: data.username || "",
            descripcion: data.descripcion || "",
            email: user.email || "",
            celular: data.celular || "",
            photoURL: data.photoURL || "",
          });
        }
      } catch (err) {
        console.error("Error al obtener datos del usuario", err);
      }
    };
    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePerfil = async (e) => {
    e.preventDefault();
    try {
      if (!user) return;

      await updateDoc(doc(db, "users", user.uid), {
        username: formData.username,
        descripcion: formData.descripcion,
        celular: formData.celular,
        photoURL: formData.photoURL,
      });

      await updateProfile(user, {
        displayName: formData.nombre,
        photoURL: formData.photoURL,
      });

      if (user.email !== formData.email) {
        await updateEmail(user, formData.email);
      }

      alert("Perfil actualizado correctamente");
      navigate("/usuario");
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      alert("Hubo un error al guardar los cambios.");
    }
  };

  const handleSaveContraseña = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las nuevas contraseñas no coinciden");
      return;
    }
    try {
      if (!user) return;

      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, passwordData.newPassword);

      alert("Contraseña actualizada correctamente");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      navigate("/perfil");
    } catch (err) {
      console.error("Error cambiando contraseña:", err);
      alert(
        "Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta."
      );
    }
  };

  const handleCancel = () => {
    navigate("/usuario");
  };

  return (
    <>
      <NavBar />
      <div id="editarperfil-container">
        <h1>Editar perfil</h1>
        <div className="tabs">
          <span
            className={activeTab === "perfil" ? "active-tab" : ""}
            onClick={() => setActiveTab("perfil")}
          >
            Perfil
          </span>
          <span
            className={activeTab === "contraseña" ? "active-tab" : ""}
            onClick={() => setActiveTab("contraseña")}
          >
            Contraseña
          </span>
        </div>

        <hr />

        {activeTab === "perfil" && (
          <div className="form-section">
            <div className="profile-picture">
              {formData.photoURL ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={formData.photoURL}
                    alt="Foto de perfil"
                    className="perfil-foto"
                  />
                  <button
                    type="button"
                    className="eliminar-foto"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, photoURL: "" }))
                    }
                  >
                    Eliminar foto de perfil
                  </button>
                </div>
              ) : (
                <AvatarInicial nombre={formData.nombre || user?.displayName} />
              )}
            </div>

            <form onSubmit={handleSavePerfil}>
              <div className="form-group">
                <label>URL foto de perfil</label>
                <input
                  type="text"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  placeholder="Pega la URL de tu foto de perfil"
                />
              </div>

              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: María Paula Ortiz"
                />
              </div>

              <div className="form-group">
                <label>Nombre de usuario</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Ej: paulisortize"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Cuéntanos sobre ti..."
                />
              </div>

              <div className="info-profile">
                <h3>Información personal</h3>
                <p>Proporciona tu información personal...</p>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@gmail.com"
                />
              </div>

              <div className="form-group">
                <label>Celular</label>
                <input
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  placeholder="123 456 7890"
                />
              </div>

              <div className="btn-group">
                <button type="submit" className="btn guardar-naranja">
                  Guardar cambios
                </button>
                <button
                  type="button"
                  className="btn cancelar"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "contraseña" && (
          <div className="form-section">
            <form onSubmit={handleSaveContraseña}>
              <div className="form-group">
                <label>Contraseña actual</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Escribe tu contraseña actual"
                  required
                />
              </div>

              <div className="form-group">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Escribe la nueva contraseña"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirmar nueva contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirma la nueva contraseña"
                  required
                />
              </div>

              <div className="btn-group">
                <button type="submit" className="btn guardar-naranja">
                  Guardar cambios
                </button>
                <button
                  type="button"
                  className="btn cancelar"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default EditarPerfil;
