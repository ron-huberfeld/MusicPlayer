function MyPlayer(g_playerId, params) {
  let g_objPlayer;
  let g_objErrorMessage;
  let g_objAudio;
  let g_songsList;
  let g_objText;
  let g_selectedSong;
  let g_objButtonNext;
  let g_objButtonPrev;

  /**
   * Build initial html page with default player settings
   */
  const buildPlayerHtml = () => {
    const html = `
    <div class="player-top">
      <div class="player-text">Select a song...</div>
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

  /**
   * Display the error message element
   *
   * @param {HTMLElement} element
   */
  const showErrorElement = (element) => {
    element.style.display = "block";
  };

  /**
   * Set error message string to display
   *
   * @param {String} message
   */
  const setErrorMessage = (message) => {
    if (!g_objErrorMessage) {
      alert(message);
      return false;
    }
    g_objErrorMessage.innerHTML = message;
    showErrorElement(g_objErrorMessage);
    return true;
  };

  /**
   * Get first song link object from the list of songs
   */
  const getFirstSong = () =>
    document.querySelector(`#${g_playerId} .songs-list a:first-child`);

  /**
   * Get last song link object from the list of songs
   */
  const getLastSong = () =>
    document.querySelector(`#${g_playerId} .songs-list a:last-child`);

  /**
   * Handle the click on the player's 'next' button
   */
  const handleNextClick = () => {
    if (!g_selectedSong) {
      // No selected song yet so start from the top of the list
      setLink(getFirstSong());
    } else {
      const objNextSong = g_selectedSong.nextSibling;
      if (!objNextSong) {
        // We are at the end of the list so start from the top again
        setLink(getFirstSong());
      } else {
        // Play next song
        setLink(objNextSong);
      }
    }
  };

  /**
   * Handle the click on the player's 'previous' button
   */
  const handlePrevClick = () => {
    if (!g_selectedSong) {
      // No selected song yet so start from the end of the list
      setLink(getLastSong());
    } else {
      const objPrevSong = g_selectedSong.previousSibling;
      if (!objPrevSong) {
        // We are at the top of the list so start from the end again
        setLink(getLastSong());
      } else {
        // Play previous song
        setLink(objPrevSong);
      }
    }
  };

  /**
   * Set the selected song
   *
   * @param {Object} linkObj
   */
  const setLink = (linkObj) => {
    if (g_selectedSong) {
      g_selectedSong.classList.remove("selected");
    }
    g_selectedSong = linkObj;
    g_selectedSong.classList.add("selected");
    g_objText.innerHTML = g_selectedSong.innerHTML;

    // Play song
    const { href } = linkObj;
    const htmlSong = `<source src="${href}" type="audio/mpeg">`;
    g_objAudio.innerHTML = htmlSong;
    g_objAudio.load();
    g_objAudio.play();
  };

  /**
   * Handle the click on song in the list
   *
   * @param {Event} e
   */
  const handleLinkClick = (e) => {
    // Prevent refresh
    e.preventDefault();

    // Set selected song
    setLink(e.target);
  };

  /**
   * Randomly shuffle the songs list
   *
   * @param {Array<String>} arr
   */
  const shuffleArray = (arr) =>
    arr
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);

  /**
   * Parse songs list into html elements
   *
   * @param {String} data
   */
  const parseSongList = (data) => {
    const trimData = data.trim().split("\r\n");
    let songsNameArr = trimData.map((songName) => songName.replace(".mp3", ""));
    const { folder, shuffle } = params;
    if (shuffle) {
      songsNameArr = shuffleArray(songsNameArr);
    }
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

    // Add event listener to the buttons - next/prev song
    g_objButtonNext.addEventListener("click", handleNextClick);
    g_objButtonPrev.addEventListener("click", handlePrevClick);

    // Add event listener to the player - when song ends play the next
    g_objAudio.addEventListener("ended", handleNextClick);
  };

  /**
   * Get songs list from specific folder using AJAX
   */
  const getSongList = () => {
    const { folder } = params;
    const url = `${folder}/songs.txt`;

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) {
        return false;
      }
      if (this.status !== 200) {
        setErrorMessage("Error occurred while retrieving songs");
        return false;
      }
      parseSongList(this.responseText);
      return true;
    };
    xhr.open("GET", url, true);
    xhr.send();
  };

  /**
   * Initialize player's html elements
   */
  const init = () => {
    /* Root Element */
    g_objPlayer = document.getElementById(g_playerId);
    if (!g_objPlayer) {
      setErrorMessage("Player ID not found");
      return false;
    }

    buildPlayerHtml();

    /* Error messages element */
    g_objErrorMessage = document.querySelector(`#${g_playerId} .error-message`);

    /* Audio player element */
    g_objAudio = document.querySelector(`#${g_playerId} .player-audio`);

    /* Player's current song text element */
    g_objText = document.querySelector(`#${g_playerId} .player-text`);

    /* Songs list */
    g_songsList = document.querySelector(`#${g_playerId} .songs-list`);

    /* Player's next button */
    g_objButtonNext = document.querySelector(
      `#${g_playerId} .player-button-next`
    );

    /* Player's previous button */
    g_objButtonPrev = document.querySelector(
      `#${g_playerId} .player-button-prev`
    );

    getSongList();
    return true;
  };

  init();
}
