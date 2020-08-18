function MyPlayer(g_playerId, params) {
  let g_objPlayer, g_objErrorMessage, g_objAudio, g_songsList, g_objText;

  const buildPlayerHtml = () => {
    let html = `
    <div class="player-top">
		<div class="player-text">Some Text Here</div>
		<button class="player-button player-button-prev">&lt;</button>
		<button class="player-button player-button-next">&gt;</button>
	</div>

	<audio class="player-audio" controls></audio>
	
	<div class="list-loader" style="display:none">
		Loading Songs...
	</div>
	
	<div class="error-message" style="display:none">
		Load Songs Failed
    </div>
    
    <div class="songs-list">
		<a href="songs/example.mp3" class="selected">Song Example</a>
		<a href="songs/example2.mp3" >Song Example 2</a>
		<a href="songs/example3.mp3" >Song Example 3</a>
		<a href="songs/example4.mp3" >Song Example 4</a>
	</div>
    `;
    const fetchText = async () => {
      let response = await fetch("./abba/songs.txt");
      console.log(response.status); // 200
      console.log(response.statusText); // OK
      if (response.status === 200) {
        let data = await response.text();
        console.log(data);
        // handle data
      }
    };

    fetch("https://ghibliapi.herokuapp.com/films")
      .then((response) => {
        //JSON data feed URL
        return response.json();
      })
      .then((data) => {
        // Add songs
        let songsHtml = "";
        data.map((item) => {
          let htmlSegment = `<a href="${item.title}.mp3">${item.title}</a>`;
          songsHtml += htmlSegment;
        });
        g_songsList.innerHTML = songsHtml;
      })
      .catch((err) => {
        console.log(err);
      });

    g_objPlayer.innerHTML = html;
  };

  const showElement = (element) => {
    element.style.display = block;
  };

  const displayMessage = (message) => {
    if (!g_objErrorMessage) {
      alert(message);
      return false;
    }
    g_objErrorMessage.innerHTML = message;
    showElement(g_objErrorMessage);
  };

  const init = () => {
    /* Root Element */
    g_objPlayer = document.getElementById(g_playerId);
    if (!g_objPlayer) {
      displayMessage("Player ID not found");
    }
    buildPlayerHtml();

    /* Error messages element */
    g_objErrorMessage = document.querySelector(
      "#" + g_playerId + " .error-message"
    );
    console.log(g_objErrorMessage);

    /* Audio player element */
    g_objAudio = document.querySelector("#" + g_playerId + " .player-audio");
    console.log(g_objAudio);

    /* Player's current song text element */
    g_objText = document.querySelector("#" + g_playerId + " .player-text");
    console.log(g_objText);

    /* Songs list */
    g_songsList = document.querySelector("#" + g_playerId + " .songs-list");
    console.log(g_songsList);
  };

  init();
}
