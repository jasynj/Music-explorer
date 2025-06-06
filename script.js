console.log("Hello");

let currentlyEditingId = null;

/**
 * Generate a semi-unique ID for a new playlist
 */
function generateId() {
  return (
    "pl_" +
    Math.random().toString(36).substr(2, 5) +
    "_" +
    Date.now().toString()
  );
}

/**
 * Find the index of a playlist in the global `playlists` array by its id.
 * @param {string} id 
 * @returns {number} index (or -1 if not found)
 */
function findPlaylistIndexById(id) {
  return playlists.findIndex((p) => p.id === id);
}

/**
 * Delete a playlist (both from the array and from the DOM).
 * If any detail modal is open for that playlist, close it.
 * @param {string} id 
 */
function deletePlaylist(id) {
  // 1) remove from the array
  const idx = findPlaylistIndexById(id);
  if (idx !== -1) {
    playlists.splice(idx, 1);
  }

  // 2) remove its tile from the grid (if present)
  const tile = document.querySelector(`.playlist-tile[data-id="${id}"]`);
  if (tile) {
    tile.remove();
  }

  // 3) if a detail modal is open, close it:
  const openOverlay = document.querySelector(".modal-overlay");
  if (openOverlay) {
    openOverlay.remove();
  }
}

/**
 * Open the “Add/Edit” overlay in *edit* mode for the given playlist id.
 * Pre-fill the form with that playlist’s data so the user can modify it.
 * @param {string} id 
 */
function openEditFormFor(id) {
  const pl = playlists.find((p) => p.id === id);
  if (!pl) return;

  // Mark that we are editing an existing playlist
  currentlyEditingId = id;

  // 1) Pre-fill the form fields
  document.getElementById("playlistName").value = pl.name;
  document.getElementById("playlistAuthor").value = pl.author;
  document.getElementById("coverUrl").value = pl.cover;

  // “Songs” container: remove any extra pairs beyond the first,
  // then insert one input pair per existing track
  const songsContainer = document.getElementById("songsContainer");
  const allPairs = songsContainer.querySelectorAll(".song-pair");
  allPairs.forEach((pair, i) => {
    if (i > 0) pair.remove();
  });

  // Fill the first song-pair (if it exists)
  const firstPair = songsContainer.querySelector(".song-pair");
  if (pl.songs.length > 0) {
    firstPair.querySelector('input[name="songTitle"]').value = pl.songs[0].title;
    firstPair.querySelector('input[name="songArtist"]').value = pl.songs[0].artist;
  } else {
    firstPair.querySelector('input[name="songTitle"]').value = "";
    firstPair.querySelector('input[name="songArtist"]').value = "";
  }

  // Add additional pairs if pl.songs.length > 1
  for (let i = 1; i < pl.songs.length; i++) {
    const pair = document.createElement("div");
    pair.classList.add("song-pair");
    pair.innerHTML = `
      <input type="text" name="songTitle" placeholder="Song Title" value="${pl.songs[i].title}" required />
      <input type="text" name="songArtist" placeholder="Song Artist" value="${pl.songs[i].artist}" required />
      <button class="remove-song" type="button">×</button>
    `;
    songsContainer.appendChild(pair);
  }

  // 2) Switch the overlay’s heading + submit button text to “Edit” mode
  document.getElementById("addModalTitle").textContent = "Edit Playlist";
  document.getElementById("submitAddEdit").textContent = "Save Changes";

  // 3) Show the overlay
  document.getElementById("addModal").style.display = "flex";

  // 4) If a detail modal is currently open, close it so they don’t stack
  const openOverlay = document.querySelector(".modal-overlay");
  if (openOverlay) openOverlay.remove();
}

// ─── 2) CREATE TILE + ATTACH ICON-CLICK HANDLERS ────────────────────────────

/**
 * Build a single “.playlist-tile” DOM node for the given playlist object.
 * Attaches event listeners to the pencil (edit) icon and trash (delete) icon.
 * @param {object} pl  a playlist object with { id, name, author, cover, songs, likeCount, liked }
 */
function createPlaylistTile(pl) {
  const container = document.querySelector(".playlist-tiles-container");

  // ── A) Main tile <div>
  const tile = document.createElement("div");
  tile.classList.add("playlist-tile");
  tile.dataset.id = pl.id;

  // ── B) Cover <img>
  const img = document.createElement("img");
  img.classList.add("playlist-img");
  img.src = pl.cover;
  img.alt = `Cover for ${pl.name}`;

  // ── C) Info bar (title + author + likes)
  const infoBar = document.createElement("div");
  infoBar.classList.add("playlist-info");

  const left = document.createElement("div");
  left.classList.add("left");
  const titleP = document.createElement("p");
  titleP.classList.add("playlist-title");
  titleP.textContent = pl.name;
  const authorP = document.createElement("p");
  authorP.classList.add("playlist-author");
  authorP.textContent = pl.author;
  left.append(titleP, authorP);

  const right = document.createElement("div");
  right.classList.add("right");
  const likeCountP = document.createElement("p");
  likeCountP.classList.add("like-count");
  likeCountP.textContent = pl.likeCount;

  // “Heart” icon
  const likeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  likeIcon.setAttribute("class", "like-logo");
  likeIcon.setAttribute("height", "24px");
  likeIcon.setAttribute("viewBox", "0 0 24 24");
  likeIcon.setAttribute("fill", "none");
  likeIcon.setAttribute("stroke", "currentColor");
  likeIcon.innerHTML = `
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935
         0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733
         C5.1 3.75 3 5.765 3 8.25
         c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />`;
  likeIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!pl.liked) {
      pl.liked = true;
      pl.likeCount += 1;
      likeCountP.textContent = pl.likeCount;
      likeIcon.classList.add("liked");
    } else {
      pl.liked = false;
      pl.likeCount -= 1;
      likeCountP.textContent = pl.likeCount;
      likeIcon.classList.remove("liked");
    }
  });

  right.append(likeCountP, likeIcon);
  infoBar.append(left, right);

  // ── D) “Edit” icon in top-left corner of tile
  const editIconWrapper = document.createElement("div");
  editIconWrapper.classList.add("edit-icon");
  editIconWrapper.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 20h9" />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
      />
    </svg>
  `;
  editIconWrapper.addEventListener("click", (e) => {
    e.stopPropagation();
    openEditFormFor(pl.id);
  });
  tile.append(editIconWrapper);

  // ── E) “Delete” icon in top-right corner of tile
  const deleteIconWrapper = document.createElement("div");
  deleteIconWrapper.classList.add("delete-icon");
  deleteIconWrapper.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18" />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6"
      />
      <path stroke-linecap="round" stroke-linejoin="round" d="M10 10v6" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M14 10v6" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 6l1-3h12l1 3" />
    </svg>
  `;
  deleteIconWrapper.addEventListener("click", (e) => {
    e.stopPropagation();
    deletePlaylist(pl.id);
  });
  tile.append(deleteIconWrapper);

  // ── F) Append cover + infoBar
  tile.append(img, infoBar);
  container.appendChild(tile);

  // ── G) Clicking anywhere on the tile (except icons) opens detail modal
  tile.addEventListener("click", () => openModal(pl.id));
}


// ─── 3) “Add/Edit” FORM LOGIC ─────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".playlist-tiles-container");
  if (!container) return;

  // Remove any existing static .playlist-tile (except the “new” tile)
  container
    .querySelectorAll(".playlist-tile:not(.new-playlist-tile)")
    .forEach((el) => el.remove());

  // Render all existing playlists from data.js
  playlists.forEach((pl) => {
    pl.liked = pl.liked || false;
    pl.likeCount = pl.likeCount || 0;
    createPlaylistTile(pl);
  });

  // —–––– 3A) OPEN “ADD NEW” OVERLAY —––––––––––––––––––––––––––––––––––––––––

  const openAddBtn = document.getElementById("open-add-playlist");
  const addModal = document.getElementById("addModal");
  const closeAddModal = document.getElementById("closeAddModal");
  const addModalTitle = document.getElementById("addModalTitle");    // new id on your <h2>
  const submitAddEditButton = document.getElementById("submitAddEdit"); // new id on your submit button

  openAddBtn.addEventListener("click", () => {
    currentlyEditingId = null;
    addModalTitle.textContent = "Add New Playlist";
    submitAddEditButton.textContent = "Create Playlist";
    resetAddForm();
    addModal.style.display = "flex";
  });

  closeAddModal.addEventListener("click", () => {
    currentlyEditingId = null;
    addModal.style.display = "none";
    resetAddForm();
  });

  // —–––– 3B) “Add Song” / “Remove Song” HANDLERS —–––––––––––––––––––––––––

  const songsContainer = document.getElementById("songsContainer");
  const addSongButton = document.getElementById("addSongButton");

  // Remove a song input pair
  songsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-song")) {
      const pair = e.target.closest(".song-pair");
      if (pair) pair.remove();
    }
  });

  // Add a new song input pair
  addSongButton.addEventListener("click", () => {
    const newPair = document.createElement("div");
    newPair.classList.add("song-pair");
    newPair.innerHTML = `
      <input type="text" name="songTitle" placeholder="Song Title" required />
      <input type="text" name="songArtist" placeholder="Song Artist" required />
      <button class="remove-song" type="button">×</button>
    `;
    songsContainer.appendChild(newPair);
  });

  // —–––– 3C) SUBMIT THE FORM (CREATE vs. EDIT) —––––––––––––––––––––––––––––

  const addForm = document.getElementById("addPlaylistForm");
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("playlistName").value.trim();
    const authorInput = document.getElementById("playlistAuthor").value.trim();
    const coverInput = document.getElementById("coverUrl").value.trim();

    const songPairs = Array.from(
      songsContainer.querySelectorAll(".song-pair")
    );
    const songs = songPairs.map((pair) => {
      const title = pair
        .querySelector('input[name="songTitle"]')
        .value.trim();
      const artist = pair
        .querySelector('input[name="songArtist"]')
        .value.trim();
      return { title, artist, duration: "--:--" };
    });

    if (currentlyEditingId) {
      // —— EDIT MODE: overwrite existing playlist object ——
      const plIndex = findPlaylistIndexById(currentlyEditingId);
      if (plIndex === -1) return;

      playlists[plIndex].name = nameInput;
      playlists[plIndex].author = authorInput;
      playlists[plIndex].cover = coverInput;
      playlists[plIndex].songs = songs;

      // Update the tile in the DOM
      const tile = document.querySelector(
        `.playlist-tile[data-id="${currentlyEditingId}"]`
      );
      if (tile) {
        tile.querySelector(".playlist-img").src = coverInput;
        tile.querySelector(".playlist-title").textContent = nameInput;
        tile.querySelector(".playlist-author").textContent = authorInput;
      }

      // Close any detail modal that might be open
      const openOverlay = document.querySelector(".modal-overlay");
      if (openOverlay) openOverlay.remove();
    } else {
      // —— CREATE MODE: push new object & render a new tile ——
      const newPl = {
        id: generateId(),
        name: nameInput,
        author: authorInput,
        cover: coverInput,
        songs,
        likeCount: 0,
        liked: false,
      };
      playlists.push(newPl);
      createPlaylistTile(newPl);
    }

    // Reset state + close overlay
    currentlyEditingId = null;
    addModal.style.display = "none";
    resetAddForm();
  });

  /**
   * Clears the “Add/Edit” form back to a single empty song-pair.
   */
  function resetAddForm() {
    addForm.reset();
    const allPairs = songsContainer.querySelectorAll(".song-pair");
    allPairs.forEach((pair, i) => {
      if (i > 0) pair.remove();
      else {
        pair.querySelector('input[name="songTitle"]').value = "";
        pair.querySelector('input[name="songArtist"]').value = "";
      }
    });
  }
});

// ─── 4) DETAIL MODAL (OPEN, RENDER, SHUFFLE, WIRED EDIT & DELETE) ───────────

/**
 * Opens a “detail” modal for a given playlist id. User can Shuffle, Edit, or Delete.
 * @param {string} id
 */
function openModal(id) {
  const pl = playlists.find((p) => p.id === id);
  if (!pl) return;

  // Create an overlay
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");

  // Modal container
  const modal = document.createElement("div");
  modal.classList.add("modal");

  // Close button (×)
  const closeBtn = document.createElement("button");
  closeBtn.classList.add("modal-close");
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  // Cover image
  const coverImg = document.createElement("img");
  coverImg.classList.add("modal-cover");
  coverImg.src = pl.cover;
  coverImg.alt = `Cover for ${pl.name}`;

  // Title / Author
  const title = document.createElement("h2");
  title.classList.add("modal-title");
  title.textContent = pl.name;

  const author = document.createElement("p");
  author.classList.add("modal-author");
  author.textContent = `By ${pl.author}`;

  // Songs container
  const songListContainer = document.createElement("div");
  songListContainer.classList.add("modal-songs");

  // Heading row (Track List + Shuffle + Edit + Delete buttons)
  const headingWrapper = document.createElement("div");
  headingWrapper.style.display = "flex";
  headingWrapper.style.justifyContent = "space-between";
  headingWrapper.style.alignItems = "center";

  // “Track List:” title
  const songListTitle = document.createElement("h3");
  songListTitle.textContent = "Track List:";

  // Shuffle button
  const shuffleBtn = document.createElement("button");
  shuffleBtn.classList.add("shuffle-btn");
  shuffleBtn.textContent = "Shuffle";
  shuffleBtn.addEventListener("click", () => {
    // Fisher–Yates shuffle
    for (let i = pl.songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pl.songs[i], pl.songs[j]] = [pl.songs[j], pl.songs[i]];
    }
    renderSongs();
  });

  // Edit button (in-modal)
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openEditFormFor(pl.id);
  });

  // Delete button (in-modal)
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    deletePlaylist(pl.id);
  });

  // Assemble heading row (h3 + shuffle + edit + delete)
  headingWrapper.append(songListTitle, shuffleBtn, editBtn, deleteBtn);
  songListContainer.appendChild(headingWrapper);

  // Song list <ul>
  const ul = document.createElement("ul");
  ul.classList.add("modal-song-list");

  // Helper to render the current pl.songs[] into the UL
  function renderSongs() {
    ul.innerHTML = "";
    pl.songs.forEach((song) => {
      const li = document.createElement("li");
      li.classList.add("modal-song-item");
      li.innerHTML = `
        <span class="song-title">${song.title}</span>
        <span class="song-artist">${song.artist}</span>
        <span class="song-duration">${song.duration}</span>
      `;
      ul.appendChild(li);
    });
  }
  renderSongs();
  songListContainer.appendChild(ul);

  // Append everything to the modal
  modal.append(closeBtn, coverImg, title, author, songListContainer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// ─── 5) SAMPLE DATA.JS (unchanged) ────────────────────────────────────────────
// (keep your existing `const playlists = [ … ]` here)

