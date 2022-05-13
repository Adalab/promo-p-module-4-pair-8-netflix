const express = require('express');
const cors = require('cors');
const moviesData = require("./data/movies.json");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//aquí empieza el codigo del ejercicio 4.2
server.get("/movies", (req, res) => {
  //guardamos el valor del query en una constante
  const genderFilterParam = req.query.gender ? req.query.gender : "";
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
        if (req.query.sort === "asc") {
          return sortFilterParam;
        } else {
          return sortFilterParam * -1;
        }
      }),
  });
});
