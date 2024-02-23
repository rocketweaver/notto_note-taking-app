const notes = [];

const SAVED_EVENT = 'saved-note';
const STORAGE_KEY = 'NOTTO';

function generateId() {
    return +new Date();
}

function generateNoteObject(id, title, note, dateCreated) {
    return {
      id,
      title,
      note,
      dateCreated
    }
}

function isStorageExist() {
    if(typeof(Storage) === undefined) {
        alert('Your browser is not supporting!');
        return false;
    } 

    return true;
}

function findNote(noteId) {
    for (const noteItem of notes) {
      if (noteItem.id === noteId) {
        const {id, title, note, dateCreated} = noteItem;
        return noteItem;
      }
    }
    return null;
}

function saveData() {
    if(isStorageExist()) {
        const parsed = JSON.stringify(notes);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function addNote() {
    const title = document.getElementById('title').value;
    const note = document.getElementById('note').value;
    const generatedID = generateId();
    const currentDate = new Date(); 
    const dateCreated = currentDate.getFullYear() + '-' + 
                        ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' + 
                        ('0' + currentDate.getDate()).slice(-2);

    const noteObject = generateNoteObject(generatedID, title, note, dateCreated);
    notes.push(noteObject);
  
    saveData();
}

function getId() {
    const urlParams = new URLSearchParams(window.location.search);
    const noteId = urlParams.get('id');

    return noteId;
}

function getDataById() {
    noteId = getId();

    const noteObject = findNote(Number(noteId));
    if (noteObject) {
        const form = document.getElementById('note-form');
        const title = document.getElementById('title');
        const note = document.getElementById('note');

        const noteId = document.createElement('input');
        noteId.setAttribute('name', 'id');
        noteId.setAttribute('type', 'hidden');
        noteId.setAttribute('id', 'id');

        form.appendChild(noteId);

        noteId.value = noteObject.id;
        title.value = noteObject.title;
        note.value = noteObject.note;
    }
}

function updateData() {
    if (isStorageExist()) {
        const id = document.getElementById('id').value;
        
        const title = document.getElementById('title').value;
        const note = document.getElementById('note').value;
        
        const currentDate = new Date();
        const dateCreated = currentDate.getFullYear() + '-' + 
                            ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' + 
                            ('0' + currentDate.getDate()).slice(-2);

        const noteToUpdate = findNote(Number(id));

        if (noteToUpdate) {
            noteToUpdate.title = title;
            noteToUpdate.note = note;
            noteToUpdate.dateCreated = dateCreated;

            saveData();
        } else {
            alert(`Note with ID '${id}' not found.`);
        }
    }
}



document.addEventListener(SAVED_EVENT, () => {
    alert("Note already saved!");

    window.location.href = 'index.html';
});

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('note-form');

    const storedNotes = localStorage.getItem(STORAGE_KEY);

    if (storedNotes) {
        notes.push(...JSON.parse(storedNotes));
    }

    getDataById();

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const idInput = document.getElementById('id');

        if (idInput && idInput.value) {
            updateData();
        } else {
            addNote();
        }
    });
});
