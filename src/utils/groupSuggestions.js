export const getSuggestedGroups = (prefs) => {
  const grupos = [];

  if (!prefs) return grupos;

  const { favoriteGenres = [], favoriteAuthors = [], favoriteBooks = [] } = prefs;
  const lowerAuthors = favoriteAuthors.map((a) => a.toLowerCase());

  // 🎯 Grupos por género
  if (favoriteGenres.includes("Fantasía")) {
    grupos.push({
      id: "magos-dragones",
      nombre: "Magos y Dragones 🐉",
      descripcion: "Un club para los fans de mundos mágicos y criaturas míticas.",
    });
  }
  if (favoriteGenres.includes("Romance")) {
    grupos.push({
      id: "corazones-literarios",
      nombre: "Corazones Literarios 💕",
      descripcion: "Comparte novelas románticas que te hicieron suspirar.",
    });
  }
  if (favoriteGenres.includes("Misterio")) {
    grupos.push({
      id: "detectives-papel",
      nombre: "Detectives del Papel 🔍",
      descripcion: "¿Quién fue el asesino? Averígualo con nosotros.",
    });
  }
  if (favoriteGenres.includes("Ciencia Ficción")) {
    grupos.push({
      id: "lectores-futuro",
      nombre: "Lectores del Futuro 🚀",
      descripcion: "Explora otros mundos y futuros posibles.",
    });
  }
  if (favoriteGenres.includes("Terror")) {
    grupos.push({
      id: "noche-oscura",
      nombre: "Noche de Lectura Oscura 👻",
      descripcion: "Comparte tus historias más escalofriantes.",
    });
  }

  // ✍️ Grupos por autores
  if (lowerAuthors.includes("murakami")) {
    grupos.push({
      id: "murakami-cafe",
      nombre: "Murakami & Café ☕",
      descripcion: "Comparte tus lecturas y teorías sobre Haruki Murakami.",
    });
  }
  if (lowerAuthors.includes("gabriel garcía márquez")) {
    grupos.push({
      id: "cien-lecturas",
      nombre: "Cien Lecturas de Soledad 🌾",
      descripcion: "Discute el realismo mágico y la obra de Gabo.",
    });
  }
  if (lowerAuthors.includes("j.k. rowling")) {
    grupos.push({
      id: "hogwarts",
      nombre: "Expreso a Hogwarts 🧙‍♂️",
      descripcion: "Revivamos la magia de Harry Potter juntos.",
    });
  }
  if (lowerAuthors.includes("george orwell")) {
    grupos.push({
      id: "1984",
      nombre: "1984 y Más Allá 👁️",
      descripcion: "Hablemos de distopías y control social.",
    });
  }

  // 📚 Grupos generales
  grupos.push({
    id: "lectores-nocturnos",
    nombre: "Lectores nocturnos 🌙",
    descripcion: "Si lees hasta las 3am, este grupo es para ti.",
  });

  grupos.push({
    id: "libros-tristes",
    nombre: "Club de los Libros Tristes 😢",
    descripcion: "Historias que nos rompieron el corazón.",
  });

  grupos.push({
    id: "viajeros-pagina",
    nombre: "Viajeros de Página ✈️",
    descripcion: "Literatura de otros países y culturas.",
  });

  grupos.push({
    id: "club-minimalista",
    nombre: "Club Minimalista 📖✨",
    descripcion: "Recomendamos libros cortos pero poderosos.",
  });

  grupos.push({
    id: "libros-cafe",
    nombre: "Libros con Café ☕📚",
    descripcion: "Perfecto para leer y charlar con una taza caliente.",
  });

  grupos.push({
    id: "comics-graficas",
    nombre: "Cómics y Novelas Gráficas 🎨",
    descripcion: "Para quienes aman el arte en cada página.",
  });

  grupos.push({
    id: "filosofia-todos",
    nombre: "Filosofía para Todos 🧠",
    descripcion: "Discutamos ideas que desafían la mente.",
  });

  grupos.push({
    id: "juventud-lectora",
    nombre: "Juventud Lectora 👩‍🎓",
    descripcion: "Espacio para lectores entre 15 y 25 años.",
  });

  grupos.push({
    id: "mamas-leen",
    nombre: "Mamás que Leen 👩‍👧‍👦",
    descripcion: "Historias para compartir entre crianza y descanso.",
  });

  grupos.push({
    id: "primera-lectura",
    nombre: "Primera Lectura 📘",
    descripcion: "Grupo para quienes están retomando el hábito de leer.",
  });

  return grupos;
};