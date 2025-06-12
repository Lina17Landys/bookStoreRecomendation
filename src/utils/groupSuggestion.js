export const getSuggestedGroups = (prefs) => {
  const grupos = [];

  if (!prefs) return grupos;

  const { favoriteGenres = [], favoriteAuthors = [], favoriteBooks = [] } = prefs;

  const lowerAuthors = favoriteAuthors.map((a) => a.toLowerCase());

  // 🎯 Grupos por género
  if (favoriteGenres.includes("Fantasía")) {
    grupos.push({
      nombre: "Magos y Dragones 🐉",
      descripcion: "Un club para los fans de mundos mágicos y criaturas míticas.",
    });
  }
  if (favoriteGenres.includes("Romance")) {
    grupos.push({
      nombre: "Corazones Literarios 💕",
      descripcion: "Comparte novelas románticas que te hicieron suspirar.",
    });
  }
  if (favoriteGenres.includes("Misterio")) {
    grupos.push({
      nombre: "Detectives del Papel 🔍",
      descripcion: "¿Quién fue el asesino? Averígualo con nosotros.",
    });
  }
  if (favoriteGenres.includes("Ciencia Ficción")) {
    grupos.push({
      nombre: "Lectores del Futuro 🚀",
      descripcion: "Explora otros mundos y futuros posibles.",
    });
  }
  if (favoriteGenres.includes("Terror")) {
    grupos.push({
      nombre: "Noche de Lectura Oscura 👻",
      descripcion: "Comparte tus historias más escalofriantes.",
    });
  }

  // ✍️ Grupos por autores
  if (lowerAuthors.includes("murakami")) {
    grupos.push({
      nombre: "Murakami & Café ☕",
      descripcion: "Comparte tus lecturas y teorías sobre Haruki Murakami.",
    });
  }
  if (lowerAuthors.includes("gabriel garcía márquez")) {
    grupos.push({
      nombre: "Cien Lecturas de Soledad 🌾",
      descripcion: "Discute el realismo mágico y la obra de Gabo.",
    });
  }
  if (lowerAuthors.includes("j.k. rowling")) {
    grupos.push({
      nombre: "Expreso a Hogwarts 🧙‍♂️",
      descripcion: "Revivamos la magia de Harry Potter juntos.",
    });
  }
  if (lowerAuthors.includes("george orwell")) {
    grupos.push({
      nombre: "1984 y Más Allá 👁️",
      descripcion: "Hablemos de distopías y control social.",
    });
  }

  // 📚 Grupos por hábitos o temáticas generales
  grupos.push({
    nombre: "Lectores nocturnos 🌙",
    descripcion: "Si lees hasta las 3am, este grupo es para ti.",
  });

  grupos.push({
    nombre: "Club de los Libros Tristes 😢",
    descripcion: "Historias que nos rompieron el corazón.",
  });

  grupos.push({
    nombre: "Viajeros de Página ✈️",
    descripcion: "Literatura de otros países y culturas.",
  });

  grupos.push({
    nombre: "Club Minimalista 📖✨",
    descripcion: "Recomendamos libros cortos pero poderosos.",
  });

  grupos.push({
    nombre: "Libros con Café ☕📚",
    descripcion: "Perfecto para leer y charlar con una taza caliente.",
  });

  grupos.push({
    nombre: "Cómics y Novelas Gráficas 🎨",
    descripcion: "Para quienes aman el arte en cada página.",
  });

  grupos.push({
    nombre: "Filosofía para Todos 🧠",
    descripcion: "Discutamos ideas que desafían la mente.",
  });

  grupos.push({
    nombre: "Juventud Lectora 👩‍🎓",
    descripcion: "Espacio para lectores entre 15 y 25 años.",
  });

  grupos.push({
    nombre: "Mamás que Leen 👩‍👧‍👦",
    descripcion: "Historias para compartir entre crianza y descanso.",
  });

  grupos.push({
    nombre: "Primera Lectura 📘",
    descripcion: "Grupo para quienes están retomando el hábito de leer.",
  });

  return grupos;
};
