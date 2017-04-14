const searchInput = document.querySelector('.search-input');
const form = document.querySelector('form');
const results = [];
const resultsList = document.querySelector('.search-results');
const searchOptions = document.querySelectorAll('.search-options button');
let searchSlideUp = false;

function getResults (input) {
  const searchType = document.querySelector('.active').innerHTML.toLowerCase();
  let query = input;
  const endpoint = `https://api.spotify.com/v1/search?type=${searchType}&q=${query}`;

  if (query.length < 1) {
    resultsList.classList.add('empty');
    return true;
  }

  fetch(endpoint)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);

        return;
      }
      response.json().then(function(data) {
        console.log(data);
        displayResults(data, searchType);
      });
    }
  )
  .catch(function(err) {
    console.log('Whoops!', err);
  });

}

function displayResults(data, type) {
  type = type + 's';
  let results = data[type].items;

  if (results.length < 1) {
    resultsList.classList.add('empty');
    return true;
  }

  if (resultsList.classList.contains('empty')) {
    resultsList.classList.remove('empty');
  }

  results = results.sort(function(a, b) {
    const last = a.popularity;
    const next = b.popularity;
    return last > next ? -1 : 1;
  });

  const html = results.map( result => {
    let imgLink = '';
    let imgClass = '';
    if (result.images != null) {
      imgLink = result.images.length > 0 ? result.images[0].url : '';
      imgClass = result.images.length > 0 ? 'album-cover' : 'no-album-cover';
    }
    else {
      imgLink = result.album.images.length > 0 ? result.album.images[0].url : '';
      imgClass = result.album.images.length > 0 ? 'album-cover' : 'no-album-cover';
    }

    return `
    <li>
      <img class="${imgClass}" src="${imgLink}" >
      <span class="result-name"><a href="${result.href}">${result.name}</a></span>
    </li>
    `;

  }).join('');
  resultsList.innerHTML = html;
}

var slideUp = function () {
  const main = document.querySelector('.main');
  main.classList.add('slide-up')
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!searchSlideUp) {
    searchSlideUp = !searchSlideUp;
    form.classList.add('slide-up');
  }
  getResults(searchInput.value);
});

searchInput.addEventListener('keyup', (e) => {
  if (!searchSlideUp) {
    searchSlideUp = !searchSlideUp;
    form.classList.add('slide-up');
  }
  getResults(searchInput.value);
});

searchOptions.forEach( option => {
  option.addEventListener('click', () => {
    const activeOption = document.querySelector('.active');
    activeOption.classList.remove('active');
    option.classList.add('active');
    getResults(searchInput.value);
  })
});
