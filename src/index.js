const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

// const moviesData = require("./data/movies.json");
const db = new Database('./src/data/database.db', { verbose: console.log });

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// 4.4 Express JS III

// 1. Obtener el id de la película a renderizar

server.get('/movie/:movieId', (req, res) => {
  console.log(req.params.movieId);

  // 2. Obtener la película

  const foundMovie = moviesData.movies.find(
    (movies) => movies.id === req.params.movieId
  );
  console.log(foundMovie);
});
//
//
// ----- Aquí empieza el codigo del ejercicio 4.2

// 4.2/1: Pedir todas las películas
server.get('/movies', (req, res) => {
  // 4.2/2: Filtrar por género

  //guardamos el valor del query en una constante
  // const genderFilterParam = req.query.gender ? req.query.gender : "";
  const genderFilterParam = req.query.gender;

  // preparamos la query
  const query = db.prepare('SELECT * FROM movies');

  // 4.5 Bases de datos I:
  //4.5/3: Haz un SELECT para obtener todas películas
  // ejecutamos la query para obtener todos los registros en un array
  const movieList = query.all();
  //
  //aquí respondemos con el listado filtrado

  res.json({
    success: true,
    movies: movieList
      .filter((item) => item.gender.includes(genderFilterParam))

      // 4.2/3: Función ordenador por nombre

      // "asc" hace referencia al value del input A-Z en AllMovies.js
      // Se compara con -1 porque en la segunda condición le estamos indicando que la cadena z o referenceStr(z-a) iría por delante de a o compareString(a-z)
      .sort(function (a, z) {
        const sortFilterParam = a.title.localeCompare(z.title);
        if (req.query.sort === 'asc') {
          return sortFilterParam;
        } else {
          return sortFilterParam * -1;
        }
      }),
  });
});

// ----- Aquí termina el codigo del ejercicio 4.2

// 4.6 BASES DE DATOS II:

// 4.6/2. Registro de nuevas usuarias en el back
server.post('/sign-up', (req, res) => {
  const { email, password } = req.body;

  // preparamos la query para comprobar si el email ya existe
  const queryEmail = db.prepare('SELECT * FROM users WHERE email = ?');
  // la ejecutamos indicando: SELECT * FROM users  WHERE email = 'lucia@hotmail.com' AND password = 'qwertyui'

  // 4.6/3. Comprueba que no haya una usuaria registrada con el mismo email
  const user = queryEmail.get(email);

  if (user) {
    res.json({
      success: false,
      errorMessage: 'Usuaria ya existente',
    });
  }

  // preparamos la query
  const query = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
  // ejecutamos la query
  const result = query.run(email, password);
  res.json({
    success: true,
    userId: result.lastInsertRowid,
  });
});

// 4.3 Express JS II: ESTÁTICOS

const staticServerPathWeb = './src/public-react/';
// En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWeb));

const staticServerPathWebImages = './src/public-movies-images/';
// En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWebImages));
