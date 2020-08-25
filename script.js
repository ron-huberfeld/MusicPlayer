function MyPlayer(g_playerId, params) {
  let g_objPlayer;
  let g_objErrorMessage;
  let g_objAudio;
  let g_songsList;
  let g_objText;
  let g_selectedSong;
  let g_objButtonNext;
  let g_objButtonPrev;

  const buildPlayerHtml = () => {
    const html = `
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

    g_objPlayer.innerHTML = html;
  };

  const showElement = (element) => {
    element.style.display = 'block';
  };

  const displayMessage = (message) => {
    if (!g_objErrorMessage) {
      alert(message);
      return false;
    }
    g_objErrorMessage.innerHTML = message;
    showElement(g_objErrorMessage);
    return true;
  };

  const handleLinkClick = (e) => {
    // Prevent refresh
    e.preventDefault();

    // Set selected song
    const linkObj = e.target;
    if (g_selectedSong) {
      g_selectedSong.remove("selected");
    }
    g_selectedSong = linkObj.classList;
    linkObj.classList.add("selected");
    g_objText.innerHTML = linkObj.innerHTML;

    // Play song
    const { href } = e.target;
    const htmlSong = `<source src="${href}" type="audio/mpeg">`;
    g_objAudio.innerHTML = htmlSong;
    g_objAudio.load();
    g_objAudio.play();
  };

  const parseSongList = (data) => {
    const trimData = data.trim().split("\r\n");
    const songsNameArr = trimData.map((songName) =>
      songName.replace(".mp3", "")
    );
    const { folder } = params;
    let songsHtml = "";
    songsNameArr.map(
      (songName) =>
        (songsHtml += `<a href="${folder}/${songName}.mp3">${songName}</a>`)
    );
    g_songsList.innerHTML = songsHtml;

    // Add event listener to the links
    const { children } = g_songsList;
    for (let i = 0; i < children.length; i++) {
      children[i].addEventListener("click", handleLinkClick);
    }
  };

  const getSongList = () => {
    const { folder } = params;
    const url = `${folder}/songs.txt`;

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState !== 4) {
        return false;
      }
      if (this.status !== 200) {
        displayMessage("Error occurred");
      }
      parseSongList(this.responseText);
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  };

  const init = () => {
    console.log("Start init...");
    /* Root Element */
    g_objPlayer = document.getElementById(g_playerId);
    if (!g_objPlayer) {
      displayMessage("Player ID not found");
    }

    buildPlayerHtml();

    /* Error messages element */
    g_objErrorMessage = document.querySelector(`#${g_playerId} .error-message`);
    console.log(g_objErrorMessage);

    /* Audio player element */
    g_objAudio = document.querySelector(`#${g_playerId} .player-audio`);
    console.log(g_objAudio);

    /* Player's current song text element */
    g_objText = document.querySelector(`#${g_playerId} .player-text`);
    console.log(g_objText);

    /* Songs list */
    g_songsList = document.querySelector(`#${g_playerId} .songs-list`);
    console.log(g_songsList);

    /* Songs list */
    g_objButtonNext = document.querySelector(`#${g_playerId} .player-button.player-button-next`);
    console.log(g_objButtonNext);

    /* Songs list */
    g_objButtonPrev = document.querySelector(`#${g_playerId} .player-button.player-button-prev`);
    console.log(g_objButtonPrev);

    getSongList();
  };

  init();
}
