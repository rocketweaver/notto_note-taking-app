const notes = [];

const STORAGE_KEY = 'NOTTO';
const RENDER_EVENT = 'render-note';
const REMOVED_EVENT = 'removed-note';
const SEARCH_EVENT = 'search-note';

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
      for (const note of data) {
        notes.push(note);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findNoteIndex(noteId) {
  for (const index in notes) {
    if (notes[index].id === noteId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
    if(typeof(Storage) === undefined) {
        alert('Your browser is not supporting!');
        return false;
    } 

    return true;
}

function searchNote(keyword) {
  keyword = keyword.toLowerCase();

  let searchedNotes = notes.filter(note => note.title.toLowerCase().includes(keyword));

  const searchEvent = new CustomEvent(SEARCH_EVENT, { detail: { searchedNotes } });
  document.dispatchEvent(searchEvent);
}

function saveData() {
  if(isStorageExist()) {
      const parsed = JSON.stringify(notes);
      localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function removeNote(noteId) {
  const noteTarget = findNoteIndex(noteId);

  if (noteTarget === -1) return;

  notes.splice(noteTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeNote(noteObject) {
    const {id, title, note, dateCreated} = noteObject;

    const container = document.createElement("div");
    container.classList.add("title-and-remove");

    const noteDate = document.createElement("small");
    noteDate.innerText = dateCreated;
    noteDate.classList.add("note-date");

    const noteTitle = document.createElement("h3");
    const noteLink = document.createElement("a");
    noteLink.classList.add("note-link");
    noteLink.innerText = title;
    noteLink.setAttribute('href', `add.html?id=${id}`);
    noteTitle.append(noteLink);

    const deleteBtn = document.createElement("img");
    deleteBtn.classList.add('delete-btn');
    deleteBtn.setAttribute('src', 'img/delete-btn.svg');
    deleteBtn.setAttribute('alt', 'Delete');

    container.append(noteTitle);
    container.append(deleteBtn);

    const noteItem = document.createElement("div");
    noteItem.classList.add("note-item");
    noteItem.append(noteDate);
    noteItem.append(container);
    noteItem.setAttribute('id', `note-${id}`);

    deleteBtn.addEventListener('click', function() {
      const confirmed = window.confirm("Do you want to delete this note?");
      if (confirmed) {
        noteItem.style.transition = 'all 0.5s ease';
        noteItem.style.position = 'relative';
        noteItem.style.bottom = '0';
        noteItem.style.left = '0';

        setTimeout(() => {
          noteItem.style.bottom = '50px';
        }, 30);

        setTimeout(() => {
          noteItem.style.left = '300px';
          noteItem.style.opacity = '0';
        }, 500);

        setTimeout(() => {
            removeNote(id);
        }, 1300);
      }    
    });

    return noteItem;
}

window.addEventListener('load', function() {
  const intro = document.getElementById('intro');

  intro.style.display = "flex";

  for (const child of intro.children) {
      const animation = child.animate(
          [
              { left: '-300px', opacity: 0 },
              { left: '0', opacity: 1 }
          ],
          {
              duration: 300,
              iterations: 1
          }
      );

      animation.addEventListener('finish', function() {
          setTimeout(function() {
              child.animate(
                  [
                      { left: '0', opacity: 1 },
                      { left: '300px', opacity: 0 }
                  ],
                  { 
                      duration: 150, 
                      iterations: 1 
                  }
              ).onfinish = function() {
                  intro.style.display = "none";
              };
          }, 300);
      });
  }
});

document.addEventListener('DOMContentLoaded', function () {
    if (isStorageExist()) {
      loadDataFromStorage();
    }

    const searchForm = document.getElementById('searchbar-form');

    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const search = document.getElementById('keyword').value;
      
      searchNote(search);
  });
});

document.addEventListener(RENDER_EVENT, function () {
    const noteContainer = document.querySelector(".note-container");

    noteContainer.innerHTML = '';

    for (const note of notes) {
      const noteElement = makeNote(note);
      noteContainer.append(noteElement);
    }
});

document.addEventListener(SEARCH_EVENT, function (event) {
  const noteContainer = document.querySelector(".note-container");

  noteContainer.innerHTML = '';

  const { searchedNotes } = event.detail;

  for (note of searchedNotes) {
    const noteElement = makeNote(note);
    noteContainer.append(noteElement);
  }
});