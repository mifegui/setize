function getStartPageMovies() {
  GETAndDo("https://api.themoviedb.org/3/movie/popular", setStartPageMovies);
}

function GETAndDo(url, callback, additionalText) {
  if (!additionalText) additionalText = "";
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url + addEssentialGETStuff() + additionalText);
  xhr.onload = function () {
    callback(JSON.parse(this.responseText));
  };
  xhr.send();
}

function addEssentialGETStuff() {
  return "?api_key=8a955fed5b1c1ef1e1c83da772b10930" + "&language=pt-BR";
}

function getSearchMovies() {
  //  https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
  const q = params.q; // "some_value"

  GETAndDo(
    "https://api.themoviedb.org/3/search/movie",
    setSearchedMovies,
    "&query=" + q
  );
}

function setSearchedMovies(movies) {
  let toBeText = "";
  movies.results.forEach((movie, i) => {
    toBeText += `
        <div class="movie-listed clickable mb-3" onclick="goToDetails(${movie.id})">
            <div class="row">

            <div class="col-12 col-md-3">
              <img class="img-fluid mb-3"
                width="250px"
                height="368px"
                decoding="async"
               src="https://image.tmdb.org/t/p/w400${movie.poster_path}">
            </div>

            <div class="col-12 col-md-9">
            <h2> ${movie.title} </h2>
            <p> ${movie.overview} </p>
            </div>
            
            </div>

            <br>
            <span> Nota: <strong> ${movie.vote_average}/10 </strong> </span>
        </div>
          `;
  });
  let list = document.getElementById("list");
  list.innerHTML = toBeText;
}

function getDetailsFromMovieId() {
  //  https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
  const id = params.id; // "some_value"

  GETAndDo("https://api.themoviedb.org/3/movie/" + id, createDetailsPage);
}

function createDetailsPage(details) {
  let generos = details.genres.map((g) => g.name);
  generos = generos.join(", ");

  let head = document.createElement("div");
  head.className = "main p-3 ms-auto me-auto";
  head.innerHTML = `
      <!-- <div class="position-static img-loader"></div> -->
      <h1 class="text-center">${details.title}</h1>
      <h5 class="text-center">${details.tagline}</h5>
      <img
        class="img-fluid ms-auto me-auto"
        src="https://image.tmdb.org/t/p/w780${details.backdrop_path}"
      />

      <br />
      <span>Gêneros: ${generos}</span>
      <br />
      <span>Nota: ${details.vote_average}/10</span>
      <br />
      <span>Lançamento: ${details.release_date}</span>
  `;

  let body = document.createElement("div");
  body.className = "container ps-5 pe-5";
  body.innerHTML = `
      <p>
        ${details.overview}
      </p>
 `;

  let knowMore = document.createElement("div");
  knowMore.className = "container mb-5";
  knowMore.innerHTML = `
    <a href="${details.homepage}">
      <div class="row">
        <button class="btn btn-standard ms-auto me-auto">
          <i class="fas fa-plus"></i> Saber mais
        </button>
      </div>
    </a>
  `;

  let nav = document.getElementById("nav");
  insertAfter(nav, knowMore);
  insertAfter(nav, body);
  insertAfter(nav, head);
}

function goToDetails(id) {
  location.href = "detalhes.html?id=" + id;
}

function setStartPageMovies(movies) {
  let destaques = document.getElementById("destaque");
  if (!destaques) return;
  let toBeText = "";
  movies.results.forEach((movie, i) => {
    toBeText += `
         <div class="img-loader clickable" onclick="goToDetails(${movie.id})">
            <img
              width="250px"
              height="368px"
              decoding="async"
              src="https://image.tmdb.org/t/p/w400${movie.poster_path}"
            />
          </div>
          `;
  });
  destaques.innerHTML = toBeText;
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function searchFor() {
  let p = document.getElementById("pesquisa");

  location.href = "pesquisa.html?q=" + p.value;
  return false;
}
