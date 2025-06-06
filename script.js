console.log("Hello");

let currentlyEditingId = null;

function generateId() {
  return (
    "pl_" +
    Math.random().toString(36).substr(2, 5) +
    "_" +
    Date.now().toString()
  );
}

function findPlaylistIndexById(id) {
  return playlists.findIndex((p) => p.id === id);
}

function deletePlaylist(id) {
  const idx = findPlaylistIndexById(id);
  if (idx !== -1) playlists.splice(idx, 1);

  const tile = document.querySelector(`.playlist-tile[data-id="${id}"]`);
  if (tile) tile.remove();

  const openOverlay = document.querySelector(".modal-overlay");
  if (openOverlay) openOverlay.remove();
}

function openEditFormFor(id) {
  const pl = playlists.find((p) => p.id === id);
  if (!pl) return;

  currentlyEditingId = id;

  document.getElementById("playlistName").value = pl.name;
  document.getElementById("playlistAuthor").value = pl.author;
  document.getElementById("coverUrl").value = pl.cover;

  const songsContainer = document.getElementById("songsContainer");
  const allPairs = songsContainer.querySelectorAll(".song-pair");
  allPairs.forEach((pair, i) => {
    if (i > 0) pair.remove();
  });

  const firstPair = songsContainer.querySelector(".song-pair");
  if (pl.songs.length > 0) {
    firstPair.querySelector('input[name="songTitle"]').value = pl.songs[0].title;
    firstPair.querySelector('input[name="songArtist"]').value = pl.songs[0].artist;
  } else {
    firstPair.querySelector('input[name="songTitle"]').value = "";
    firstPair.querySelector('input[name="songArtist"]').value = "";
  }

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

  document.getElementById("addModalTitle").textContent = "Edit Playlist";
  document.getElementById("submitAddEdit").textContent = "Save Changes";
  document.getElementById("addModal").style.display = "flex";

  const openOverlay = document.querySelector(".modal-overlay");
  if (openOverlay) openOverlay.remove();
}

function createPlaylistTile(pl) {
  const container = document.querySelector(".playlist-tiles-container");

  const tile = document.createElement("div");
  tile.classList.add("playlist-tile");
  tile.dataset.id = pl.id;

  const img = document.createElement("img");
  img.classList.add("playlist-img");
  img.src = pl.cover;
  img.alt = `Cover for ${pl.name}`;

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

  tile.append(img, infoBar);
  container.appendChild(tile);

  tile.addEventListener("click", () => openModal(pl.id));
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".playlist-tiles-container");
  if (!container) return;

  container
    .querySelectorAll(".playlist-tile:not(.new-playlist-tile)")
    .forEach((el) => el.remove());

  playlists.forEach((pl) => {
    pl.liked = pl.liked || false;
    pl.likeCount = pl.likeCount || 0;
    createPlaylistTile(pl);
  });

  const openAddBtn = document.getElementById("open-add-playlist");
  const addModal = document.getElementById("addModal");
  const closeAddModal = document.getElementById("closeAddModal");
  const addModalTitle = document.getElementById("addModalTitle");
  const submitAddEditButton = document.getElementById("submitAddEdit");

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

  const songsContainer = document.getElementById("songsContainer");
  const addSongButton = document.getElementById("addSongButton");

  songsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-song")) {
      const pair = e.target.closest(".song-pair");
      if (pair) pair.remove();
    }
  });

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
      const title = pair.querySelector('input[name="songTitle"]').value.trim();
      const artist = pair
        .querySelector('input[name="songArtist"]')
        .value.trim();
      return { title, artist, duration: "--:--" };
    });

    if (currentlyEditingId) {
      const plIndex = findPlaylistIndexById(currentlyEditingId);
      if (plIndex === -1) return;

      playlists[plIndex].name = nameInput;
      playlists[plIndex].author = authorInput;
      playlists[plIndex].cover = coverInput;
      playlists[plIndex].songs = songs;

      const tile = document.querySelector(
        `.playlist-tile[data-id="${currentlyEditingId}"]`
      );
      if (tile) {
        tile.querySelector(".playlist-img").src = coverInput;
        tile.querySelector(".playlist-title").textContent = nameInput;
        tile.querySelector(".playlist-author").textContent = authorInput;
      }

      const openOverlay = document.querySelector(".modal-overlay");
      if (openOverlay) openOverlay.remove();
    } else {
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

    currentlyEditingId = null;
    addModal.style.display = "none";
    resetAddForm();
  });

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

function openModal(id) {
  const pl = playlists.find((p) => p.id === id);
  if (!pl) return;

  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");

  const modal = document.createElement("div");
  modal.classList.add("modal");

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("modal-close");
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  const coverImg = document.createElement("img");
  coverImg.classList.add("modal-cover");
  coverImg.src = pl.cover;
  coverImg.alt = `Cover for ${pl.name}`;

  const title = document.createElement("h2");
  title.classList.add("modal-title");
  title.textContent = pl.name;

  const author = document.createElement("p");
  author.classList.add("modal-author");
  author.textContent = `By ${pl.author}`;

  const songListContainer = document.createElement("div");
  songListContainer.classList.add("modal-songs");

  const headingWrapper = document.createElement("div");
  headingWrapper.style.display = "flex";
  headingWrapper.style.justifyContent = "space-between";
  headingWrapper.style.alignItems = "center";

  const songListTitle = document.createElement("h3");
  songListTitle.textContent = "Track List:";

  const shuffleBtn = document.createElement("button");
  shuffleBtn.classList.add("shuffle-btn");
  shuffleBtn.textContent = "Shuffle";
  shuffleBtn.addEventListener("click", () => {
    for (let i = pl.songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pl.songs[i], pl.songs[j]] = [pl.songs[j], pl.songs[i]];
    }
    renderSongs();
  });

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openEditFormFor(pl.id);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    deletePlaylist(pl.id);
  });

  headingWrapper.append(songListTitle, shuffleBtn, editBtn, deleteBtn);
  songListContainer.appendChild(headingWrapper);

  const ul = document.createElement("ul");
  ul.classList.add("modal-song-list");

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

  modal.append(closeBtn, coverImg, title, author, songListContainer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
