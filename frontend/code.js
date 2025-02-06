const { text } = require("body-parser")

function init() {
    try {
        let infoText = document.getElementsByClassName('status')[0]
        infoText.innerHTML = "All changes saved"
        fetchAndShowNotes()
    } catch (error) {
        console.error('Error initializing:', error)
    }
}

async function fetchAndShowNotes() {
    try {
        let response = await fetch('https://notes-server-y4xk.onrender.com/notes')
        let notes = await response.json()
        showNotes(notes)
    } catch (error) {
        console.error('Error fetching notes:', error)
    }
    
}

function renderNote(note) {
    try {
        let notesContainer = document.getElementById('notesContainer')

        let noteDiv = document.createElement('div')
        noteDiv.classList.add('note')
        
        let headerInput = document.createElement('input')
        headerInput.classList.add('input')
        headerInput.value = note.header
        headerInput.placeholder = "Enter header"
        noteDiv.appendChild(headerInput)
    
        let deleteButton = document.createElement('span')
        deleteButton.classList.add('delete')
        let x = document.createTextNode(' x ')
        deleteButton.appendChild(x)
    
        deleteButton.onclick = function () {
            removeNote(note._id)
        }
        noteDiv.appendChild(deleteButton)
    
        let textInput = document.createElement('textarea')
        textInput.classList.add('textarea')
        textInput.value = note.text
        textInput.placeholder = "Enter text"
        noteDiv.appendChild(textInput)
    
        headerInput.addEventListener('blur', async () => {
            try {
                await updateNote(note._id, headerInput.value, textInput.value)
                init()
                headerInput.style.border = ""
            } catch (error) {
                console.error('Error updating note locally:', error)
            }
        })
        headerInput.addEventListener('focus', () => {
            let infoText = document.getElementsByClassName('status')[0]
            infoText.innerHTML = "Editing note..."
            headerInput.style.border = "2px solid black"
        })
    
        textInput.addEventListener('blur', async () => {
            try {
                await updateNote(note._id, headerInput.value, textInput.value)
                init()
                headerInput.style.border = ""
            } catch (error) {
                console.error('Error updating note locally:', error)
            }
        })
        textInput.addEventListener('focus', () => {
            let infoText = document.getElementsByClassName('status')[0]
            infoText.innerHTML = "Editing note..."
            textInput.style.border = "1px solid black"
        })
    
        notesContainer.appendChild(noteDiv)
    } catch (error) {
        console.error('Error rendering note:', error)
    }
}

async function createNote(note) {
    try {
        let notesContainer = document.getElementById('notesContainer')

        let noteDiv = document.createElement('div')
        noteDiv.classList.add('note')
    
        let headerInput = document.createElement('input')
        headerInput.classList.add('input')
        headerInput.placeholder = "Enter header"
        noteDiv.appendChild(headerInput)
    
        let deleteButton = document.createElement('span')
        deleteButton.classList.add('delete')
        let x = document.createTextNode(' x ')
        deleteButton.appendChild(x)
        noteDiv.appendChild(deleteButton)
    
        let textInput = document.createElement('textarea')
        textInput.classList.add('textarea')
        textInput.placeholder = "Enter text"
        noteDiv.appendChild(textInput)
    
        
        notesContainer.insertBefore(noteDiv, notesContainer.firstChild)
    
        
        const response = await fetch('https://notes-server-y4xk.onrender.com/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                header: headerInput.value,
                text: textInput.value
            })
        })

        const savedNote = await response.json()
        console.log('Note saved', savedNote)

        headerInput.addEventListener('blur', async () => {
            try {
                await updateNote(note._id, headerInput.value, textInput.value)
                init()
                headerInput.style.border = ""
            } catch (error) {
                console.error('Error updating note locally:', error)
            }
        })
        headerInput.addEventListener('focus', () => {
            let infoText = document.getElementsByClassName('status')[0]
            infoText.innerHTML = "Editing note..."
            headerInput.style.border = "2px solid black"
        })

        textInput.addEventListener('blur', async () => {
            try {
                await updateNote(note._id, headerInput.value, textInput.value)
                init()
                headerInput.style.border = ""
            } catch (error) {
                console.error('Error updating note locally:', error)
            }
        })
        textInput.addEventListener('focus', () => {
            let infoText = document.getElementsByClassName('status')[0]
            infoText.innerHTML = "Editing note..."
            textInput.style.border = "1px solid black"
        })

        deleteButton.onclick = function () {
            removeNote(savedNote._id)
        }
        init()
    } catch (error) {
        console.error('Error creating note:', error)
    }

}

async function showNotes(notes) {
    try {
        let notesContainer = document.getElementById('notesContainer')
        let infoText = document.getElementsByClassName('status')[0]
    
        notesContainer.innerHTML = ''
    
        if (notes.length === 0) {
            infoText.innerHTML = 'No Notes'
        } else {
            notes.reverse().forEach(note => {
                
                renderNote(note)
            })
            infoText.innerHTML = 'All changes saved'
            }
    } catch (error) {
        console.error('Error showing notes:', error)
    }
}

async function removeNote(id) {
    try {
        const response = await fetch('https://notes-server-y4xk.onrender.com/notes/'+id, {
            method: 'DELETE'
        })
        if (response.ok) {
            console.log('Note deleted from server')

           fetchAndShowNotes()

            let notesContainer = document.getElementById('notesContainer')
            if (!notesContainer.hasChildNodes()) {
                let infoText = document.getElementsByClassName('status')[0]
                infoText.innerHTML = 'No Notes'
            }
        } else {
            console.error('Failed to delete note')
        }
    } catch (error) {
        console.error('Error deleting note', error)
    }
}

async function updateNote(id, updatedHeader, updatedText) {
    try {
        const response = await fetch('https://notes-server-y4xk.onrender.com/notes/'+id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                header: updatedHeader,
                text: updatedText
            })
        })

        if (response.ok) {
            console.log('Note updated sucesfully')
        } else {
            console.error('Failed to update note')
        }
    } catch (error) {
        console.error('Error updating note:', error)
    }
}
