// src/utils/groupUtils.js
import { doc, getDoc, updateDoc, arrayUnion, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

// Función para unirse a un grupo
export const joinGroup = async (userId, groupData) => {
  try {
    console.log("Intentando unirse al grupo:", groupData);
    
    // 1. Verificar que el grupo tenga un ID válido
    if (!groupData.id) {
      throw new Error("El grupo no tiene un ID válido");
    }

    // 2. Crear/verificar que el grupo existe en la base de datos
    const groupRef = doc(db, "groupChats", groupData.id);
    const groupSnap = await getDoc(groupRef);
    
    if (!groupSnap.exists()) {
      // Si el grupo no existe, crearlo (para grupos sugeridos)
      console.log("Creando grupo en la base de datos:", groupData);
      await setDoc(groupRef, {
        nombre: groupData.nombre,
        descripcion: groupData.descripcion,
        integrantes: [userId], // Agregar al usuario como primer integrante
        createdAt: serverTimestamp(),
      });
    } else {
      // Si existe, agregar al usuario a la lista de integrantes
      const existingData = groupSnap.data();
      if (!existingData.integrantes?.includes(userId)) {
        await updateDoc(groupRef, {
          integrantes: arrayUnion(userId)
        });
      }
    }

    // 3. Agregar el grupo a la lista de grupos del usuario
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentGroups = userData.myGroups || [];
      
      // Verificar si el usuario ya está en el grupo
      const alreadyJoined = currentGroups.some(g => g.id === groupData.id);
      
      if (!alreadyJoined) {
        const newGroup = {
          id: groupData.id,
          nombre: groupData.nombre,
          descripcion: groupData.descripcion,
          joinedAt: new Date().toISOString()
        };
        
        await updateDoc(userRef, {
          myGroups: arrayUnion(newGroup)
        });
        
        console.log("Usuario agregado al grupo exitosamente");
        return { success: true, message: "Te has unido al grupo exitosamente" };
      } else {
        return { success: false, message: "Ya formas parte de este grupo" };
      }
    } else {
      // Si el documento del usuario no existe, crearlo
      const newGroup = {
        id: groupData.id,
        nombre: groupData.nombre,
        descripcion: groupData.descripcion,
        joinedAt: new Date().toISOString()
      };
      
      await setDoc(userRef, {
        myGroups: [newGroup],
        createdAt: serverTimestamp()
      });
      
      return { success: true, message: "Te has unido al grupo exitosamente" };
    }
    
  } catch (error) {
    console.error("Error al unirse al grupo:", error);
    return { success: false, message: error.message || "Error al unirse al grupo" };
  }
};

// Función para salir de un grupo
export const leaveGroup = async (userId, groupId) => {
  try {
    // 1. Remover al usuario de la lista de integrantes del grupo
    const groupRef = doc(db, "groupChats", groupId);
    const groupSnap = await getDoc(groupRef);
    
    if (groupSnap.exists()) {
      const groupData = groupSnap.data();
      const updatedIntegrantes = groupData.integrantes?.filter(id => id !== userId) || [];
      
      await updateDoc(groupRef, {
        integrantes: updatedIntegrantes
      });
    }

    // 2. Remover el grupo de la lista del usuario
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const updatedGroups = userData.myGroups?.filter(g => g.id !== groupId) || [];
      
      await updateDoc(userRef, {
        myGroups: updatedGroups
      });
    }
    
    return { success: true, message: "Has salido del grupo exitosamente" };
    
  } catch (error) {
    console.error("Error al salir del grupo:", error);
    return { success: false, message: "Error al salir del grupo" };
  }
};

// Función para obtener los datos completos de un grupo
export const getGroupData = async (groupId) => {
  try {
    const groupRef = doc(db, "groupChats", groupId);
    const groupSnap = await getDoc(groupRef);
    
    if (groupSnap.exists()) {
      return { success: true, data: { id: groupId, ...groupSnap.data() } };
    } else {
      return { success: false, message: "Grupo no encontrado" };
    }
  } catch (error) {
    console.error("Error al obtener datos del grupo:", error);
    return { success: false, message: "Error al obtener datos del grupo" };
  }
};