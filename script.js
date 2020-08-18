async function fetchText() {
  let response = await fetch("./abba/songs.txt");
  console.log(response.status); // 200
  console.log(response.statusText); // OK
  if (response.status === 200) {
    let data = await response.text();
    console.log(data);
    // handle data
  }
}

fetch("https://ghibliapi.herokuapp.com/films")
  .then((response) => {
    //JSON data feed URL
    return response.json();
  })
  .then((data) => {
    // Add songs
    let html = "";
    data.map((item) => {
      let htmlSegment = `<a href="${item.title}.mp3">${item.title}</a>`;
      html += htmlSegment;
    });
    const songItem = document.querySelector(".songs-list");
    songItem.innerHTML = html;
  })
  .catch((err) => {
    console.log(err);
  });

/* Root Element */
const app = document.getElementById("my_player");

/* Songs list */
const songs = document.createElement("div");
songs.setAttribute("class", "songs-list");
app.appendChild(songs);

// fetchText();
