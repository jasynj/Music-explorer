document.addEventListener("DOMContentLoaded", () => {
// 1) Find the container where we’ll render the featured playlist
const container = document.querySelector(".featured-container");
if (!container) return;

// 2) Pick one playlist at random from the global `playlists` array
// (data.js must define `playlists = [ { id, name, author, cover, songs: [...] }, … ]`)
const randomIndex = Math.floor(Math.random() * playlists.length);
const pl = playlists[randomIndex];

// 3) Build the “card” that shows cover, name, author, and track list
const card = document.createElement("div");
card.classList.add("featured-card");

// playlist cover image
const img = document.createElement("img");
img.src = pl.cover;
img.alt = `Cover for ${pl.name}`;
card.appendChild(img);

// playlist name
const title = document.createElement("h2");
title.textContent = pl.name;
card.appendChild(title);

// Playlist author
const authorP = document.createElement("p");
authorP.classList.add("playlist-author");
authorP.textContent = `By ${pl.author}`;
card.appendChild(authorP);

// Track‐list heading + UL
const ul = document.createElement("ul");
ul.classList.add("track-list");

pl.songs.forEach(song => {
const li = document.createElement("li");

const spanTitle = document.createElement("span");
spanTitle.classList.add("track-title");
spanTitle.textContent = song.title;

const spanArtist = document.createElement("span");
spanArtist.classList.add("track-artist");
spanArtist.textContent = song.artist;

const spanDur = document.createElement("span");
spanDur.classList.add("track-duration");
spanDur.textContent = song.duration;

li.append(spanTitle, spanArtist, spanDur);
ul.appendChild(li);
});

card.appendChild(ul);
container.appendChild(card);
});
