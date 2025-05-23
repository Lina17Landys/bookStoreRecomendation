import React, { useState } from 'react';

const Recomendador = () => {
  const [preferencias, setPreferencias] = useState('');
  const [genero, setGenero] = useState('fantasy');
  const [respuesta, setRespuesta] = useState('');
  const [libros, setLibros] = useState([]);
  const [grupos, setGrupos] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = 'https://ab23-35-239-93-209.ngrok-free.app/recomendar'; // Reemplaza por tu URL real
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferencias, genero })
      });
      const data = await res.json();
      setRespuesta(data.respuesta);
      setLibros(data.libros || []);
      setGrupos(data.grupos || []);
    } catch (err) {
      console.error('Error al obtener recomendaciones:', err);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '990px', margin: '0 auto' }}>
      <h2>¿Qué te gusta leer?</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <textarea
          placeholder="Describe tus gustos literarios..."
          value={preferencias}
          onChange={(e) => setPreferencias(e.target.value)}
          style={{ padding: '12px', fontSize: '16px', width: '100%', height: '80px' }}
        />
        <select value={genero} onChange={(e) => setGenero(e.target.value)} style={{ padding: '10px', fontSize: '16px' }}>
          <option value="fantasy">Fantasía</option>
          <option value="romance">Romance</option>
          <option value="mystery">Misterio</option>
          <option value="sci-fi">Ciencia ficción</option>
          <option value="historical">Histórico</option>
        </select>
        <button type="submit" style={{ padding: '12px', fontSize: '16px', background: '#ff5a1f', color: 'white', border: 'none', borderRadius: '6px' }}>
          Recomendar
        </button>
      </form>

      {respuesta && (
        <div style={{ marginTop: '24px', fontWeight: 'bold' }}>
          {respuesta}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '24px' }}>
        {libros.map((libro, index) => (
          <div key={index} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', width: '180px' }}>
            <img src={libro.imagen} alt={libro.titulo} style={{ width: '100%', borderRadius: '4px' }} />
            <h4>{libro.titulo}</h4>
            <p>{libro.autor}</p>
          </div>
        ))}
      </div>

      {grupos.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h4>Grupo recomendado:</h4>
          <p>{grupos[0].nombre}</p>
        </div>
      )}
    </div>
  );
};

export default Recomendador;