console.log("Hello");

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".playlist-tiles-container");
    if (!container) return;

    playlists.forEach((pl) => {
    pl.liked = false;

    // Create the main tile container
    const tile = document.createElement("div");
    tile.classList.add("playlist-tile");
    tile.dataset.id = pl.id;

    // Cover image
    const img = document.createElement("img");
    img.classList.add("playlist-img");
    img.src = pl.cover;
    img.alt = `Cover for ${pl.name}`;

    // Info bar
    const infoBar = document.createElement("div");
    infoBar.classList.add("playlist-info");

    // Left side: title + author
    const left = document.createElement("div");
    left.classList.add("left");

    const titleP = document.createElement("p");
    titleP.classList.add("playlist-title");
    titleP.textContent = pl.name;

    const authorP = document.createElement("p");
    authorP.classList.add("playlist-author");
    authorP.textContent = pl.author;

    left.append(titleP, authorP);

    // Right side: like count + icon
    const right = document.createElement("div");
    right.classList.add("right");

    const likeCountP = document.createElement("p");
    likeCountP.classList.add("like-count");
    likeCountP.textContent = pl.likeCount;

    const likeIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
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

    // Toggle like/unlike
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

    // Edit‐icon wrapper
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
      // implement edit functionality here
    });
    tile.append(editIconWrapper);

    // Delete‐icon wrapper
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
      // implement delete functionality here
    });
    tile.append(deleteIconWrapper);

    tile.append(img, infoBar);
    container.appendChild(tile);

    // When tile clicked, open its modal
    tile.addEventListener("click", () => openModal(pl.id));
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

    // Container for songs + shuffle button
    const songListContainer = document.createElement("div");
    songListContainer.classList.add("modal-songs");

    // Heading + shuffle button wrapper
    const headingWrapper = document.createElement("div");
    headingWrapper.style.display = "flex";
    headingWrapper.style.justifyContent = "space-between";
    headingWrapper.style.alignItems = "center";
    headingWrapper.setAttribute("class", "")
    
    const songListTitle = document.createElement("h3");
    songListTitle.textContent = "Track List:";
    
    const shuffleBtn = document.createElement("button");
    shuffleBtn.classList.add("shuffle-btn");
    shuffleBtn.textContent = "Shuffle";
    
    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "Edit"
    
    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete"
    
    headingWrapper.append(editBtn, deleteBtn);
    headingWrapper.append(songListTitle, shuffleBtn);
    songListContainer.appendChild(headingWrapper);

    // <ul> for song items
    const ul = document.createElement("ul");
    ul.classList.add("modal-song-list");

    // Function to render `pl.songs` into the UL
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

    // Initial render
    renderSongs();
    songListContainer.appendChild(ul);

    // Shuffle‐logic: Fisher–Yates
    shuffleBtn.addEventListener("click", () => {
        for (let i = pl.songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pl.songs[i], pl.songs[j]] = [pl.songs[j], pl.songs[i]];
        }
        renderSongs();
    });

    modal.append(closeBtn, coverImg, title, author, songListContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

});
