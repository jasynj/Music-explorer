## Unit Assignment: Music Playlist Explorer

Submitted by: **JASON CHIMDINMA JASON**

Estimated time spent: **68** hours spent in total

Deployed Application (**required**): [Music Playlist Explorer Deployed Site](https://music-explorer-q4z2.onrender.com/)

### Application Features

#### CORE FEATURES

#### CORE FEATURES

- [x] **Display Playlists**
  - [x] Dynamically render playlists on the homepage using JavaScript.
    - [x] Playlists should be shown in grid view.
    - [x] Playlist images should be reasonably sized (at least 6 playlists on your laptop when full screen; large enough that the playlist components detailed in the next feature are legible).
  - [x] Fetch data from a provided Javascript file and use it to create interactive playlist tiles.

- [x] **Playlist Components**
  - [x] Each tile should display the playlist's:
    - [x] Cover image
    - [x] Name
    - [x] Author
    - [x] Like count

- [x] **Playlist Details**
  - [x] Create a modal pop-up view that displays detailed information about a playlist when a user clicks on a playlist tile.
  - [x] The modal should show the playlist's:
    - [x] Cover image
    - [x] Name
    - [x] Author
    - [x] List of songs, including each song's:
      - [x] Title
      - [x] Artist
      - [x] Duration
  - [x] The modal itself should:
    - [x] Not occupy the entire screen.
    - [x] Have a shadow to show that it is a pop-up.
    - [x] Appear floating on the screen.
    - [x] The backdrop should appear darker or in a different shade.

- [x] **Like Playlists**
  - [x] Implement functionality to allow users to like playlists by clicking a heart icon on each playlist tile.
  - [x] When the heart icon is clicked:
    - [x] If previously unliked:
      - [x] The like count on the playlist tile should increase by 1.
      - [x] There should be visual feedback (such as the heart turning a different color) to show that the playlist has been liked by the user.
    - [x] If previously liked:
      - [x] The like count on the playlist tile should decrease by 1.
      - [x] There should be visual feedback (such as the heart turning a different color) to show that the playlist has been unliked by the user.
    - [x] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS:** In addition to showcasing the above features, for ease of grading, please film yourself liking and unliking:
      - [x] a playlist with a like count of 0
      - [x] a playlist with a non-zero like count

- [x] **Shuffle Songs**
  - [x] Enable users to shuffle the songs within a playlist using a shuffle button in the playlist's detail modal.
  - [x] When the shuffle button is clicked, the playlist's songs should display in a different order.
  - [x] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS:** In addition to showcasing the above features, for ease of grading, please show yourself shuffling the same playlist more than once.

- [x] **Featured Page**
  - [x] Application includes a dedicated page that randomly selects and displays a playlist, showing the playlist’s:
    - [x] Playlist Image
    - [x] Playlist Name
    - [x] List of songs, including each song's:
      - [x] Title
      - [x] Artist
      - [x] Duration
  - [x] When the page is refreshed or reloaded, a new random playlist is displayed

    - For example, navigating to the all playlists page and then back to the featured playlist page should result in a new random playlist being displayed
    - Note that because your algorithm will not be truly random, it is possible that the same playlist will feature twice in a row.
    - - [x] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS:** In addition to showcasing the above features, for ease of grading, please show yourself refreshing the featured page more than once.
  - [x] Application includes a navigation bar or some other mechanism such that users can navigate to the page with all playlists from the featured page and vice versa without using the browser's back and forward buttons.

#### STRETCH FEATURES

- [x] **Add New Playlists**
  - [x] Allow users to create new playlists.
  - [x] Using a form, users can input playlist:
    - [x] Name
    - [x] Author
    - [x] Cover image
    - [x] Add one or more songs to the playlist, specifying the song's:
      - [x] Title
      - [x] Artist
  - [x] The resulting playlist should display in the grid view.
  - [x] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS:** For ease of grading, please show yourself adding at least two songs to the playlist.

- [x] **Edit Existing Playlists**
  - [x] Enable users to modify the details of existing playlists.
  - [x] Add an edit button to each playlist tile.
  - [x] Users can update the playlist:
    - [x] Name
    - [x] Author
    - [x] Songs
  - [x] The playlist grid view and playlist detail modal should update to display any changes (see Required Features, Criterion 1 & 2).
  - [x] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS:** For ease of grading, please show yourself:
    - [x] Editing all of a playlist's features (name, creator, AND songs)
    - [x] Editing some of a playlist's features (name, creator, OR songs)

- [x] **Delete Playlists**
  - [x] Add a delete button to each playlist tile within the grid view.
  - [x] When clicked, the playlist is removed from the playlist grid view.

- [] **Search Functionality**
  - [] Implement a search bar that allows users to filter playlists by:
    - [] Name
    - [] Author
  - [x] The search bar should include:
    - [x] Text input field
    - [x] Submit/Search Button
    - [] Clear Button
  - [] Playlists matching the search query in the text input are displayed in a grid view when the user:
    - [] Presses the Enter Key
    - [] Clicks the Submit/Search Button
  - [] User can click the clear button. When clicked:
    - [] All text in the text input field is deleted
    - [] All playlists in the `data.json` file are displayed in a grid view
    - [] **Optional:** If the Add Playlist, Edit Existing Playlist, or Delete Playlist stretch features were implemented:
      - [] If users can add a playlist, added playlists should be included in search results.
      - [] If users can edit a playlist, search results should reflect the latest edits to each playlist.
      - [] If users can delete a playlist, deleted playlists should no longer be included in search results.
      - **Note:** You will not be graded on the implementation of this optional subfeature to keep your grade of this stretch feature independent of your implementation of other stretch features. However, we highly suggest including this in your implementation to model realistic behavior of real applications.

- [] **Sorting Options**
  - [] Implement a drop-down or button options that allow users to sort the playlist by:
    - [] Name (A-Z alphabetically)
    - [] Number of likes (descending order)
    - [] Date added (most recent to oldest, chronologically)
  - [] Selecting a sort option should result in a reordering based on the selected sort while maintaining a grid view.

### Walkthrough Video

[Walkthrough Video](https://www.loom.com/share/a5c8cd956cad46b1b363507febe92c36?sid=d597558d-654b-4976-879f-c9cc48e625a6)


### Reflection

* Did the topics discussed in your labs prepare you to complete the assignment? Be specific, which features in your weekly assignment did you feel unprepared to complete?

Absolutely—the weekly labs on DOM querying/manipulation, event handling, and modular JavaScript really laid the groundwork. I felt confident wiring up form inputs, creating and appending elements, and attaching listeners. The one area I felt a bit under-prepared was dynamically reusing the “Add New” form for editing existing playlists (pre-filling inputs and swapping submit behavior)—that required juggling state and multiple code paths in the same handler, which we hadn’t practiced in quite that pattern.

* If you had more time, what would you have done differently? Would you have added additional features? Changed the way your project responded to a particular event, etc.
I would love to add dark mode/light mode toggle feature
I would have completed my search and sort features
Add user log in, sign up, and account handling so users could share playlists they create with friends they have added.
I would implement a 'New Arrivals' page for weekly ai generated playlists that match the users style

* Reflect on your project demo, what went well? Were there things that maybe didn't go as planned? Did you notice something that your peer did that you would like to try next time?
Yes, one of my peers (Imani) had a feature to add a delete function to all playlist tiles to ease the deleting process much like iOS style of deleting.

Something that didn't go as planned - I useda css grid to do my tiles. including the add new playlist section. it was a stretched out column. i would have made that a seperate block from the rest of my playlist tiles because i was then unable to add space or other elements in between the add new playlist section and the rest of the tiles.

### Open-source libraries used
None

### Shout out
TA - Mr Jesus Perez
Intern Manager - Ameya Gawde
Paige & Michelle - for all the vocal and technical support
King Igbozuruike & Angel Balogun & Eniola Farinde - My friends/support system who kept pushing me to go farther and implement as much as i can
