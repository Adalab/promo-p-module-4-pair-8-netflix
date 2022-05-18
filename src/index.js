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

//17-05
// 1. Añade un endpoint a src/index.js del tipo server.get('/movie/:movieId', (req, res) => { ... });.
server.get('/movie/:movieId', (req, res) => {
  console.log(req.params.movieId);

  // 2. En ejercicios anteriores ya has importado las películas (movies) al principio de src/index.js las movies.
  // Con un find busca en ese array de películas que has importado la que tenga el mismo id que estás recibiendo por URL params. Guárdala en una constante, por ejemplo en const foundMovie =

  const foundMovie = moviesData.movies.find(
    (movies) => movies.id === req.params.movieId
  );
  console.log(foundMovie);
});

//aquí empieza el codigo del ejercicio 4.2
server.get("/movies", (req, res) => {
  //guardamos el valor del query en una constante (forma antigua)
  // const genderFilterParam = req.query.gender ? req.query.gender : "";
  // preparamos la query
const query = db.prepare('SELECT * FROM movies');
// ejecutamos la query para obtener todos los registros en un array
const users = query.all();
// ejecutamos la query para obtener el primer registro en un objeto
const user = query.get();
// 
const query =query.all(db.prepare (`SELECT * FROM movies`)) 
  //aquí respondemos con el listado filtrado
  res.json({
    success: true,
    movies: moviesData.movies
      .filter((item) => item.gender.includes(genderFilterParam))
      //función para ordenar
      //"asc" hace referencia al value del input A-Z en AllMovies.js
      //Se compara con -1 porque en la segunda condición le estamos indicando que la cadena z o referenceStr(z-a) iría por delante de a o compareString(a-z)
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

const staticServerPathWeb = './src/public-react/';
// En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWeb));

const staticServerPathWebImages = './src/public-movies-images/';
// En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWebImages));
