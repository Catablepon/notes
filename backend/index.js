const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

// cors - allow connection from different domains and ports
app.use(cors())

// convert json string to json object (from request)
app.use(express.json())

// mongo here
const mongoose = require('mongoose')
const mongoDB = 'mongodb+srv://AE8891:asdasdasd@fullstack.9svpw.mongodb.net/?retryWrites=true&w=majority&appName=Fullstack'
mongoose.connect(mongoDB)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.log("Database test connected")
})

// schema
const notesSchema = new mongoose.Schema({
    header: { type: String, required: false},
    text: { type: String, required: false }
})

// model
const Notes = mongoose.model('Notes', notesSchema, 'notes')

// GET all
app.get('/notes', async (request, response) => {
    try {
        const notes = await Notes.find({})
        response.json(notes)
    } catch (error) {
        response.status(500).json({ error: error.message })
    }
    
})

// GET one
app.get('/notes/:id', async (request, response) => {
    try {
        const note = await Notes.findById(request.params.id)
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    } catch (error) {
        response.status(500).json({ error: error.message })
    }
    
})

// POST
app.post('/notes', async (request, response) => {
    const { header, text } = request.body
    const note = new Notes({
        header: header,
        text: text
    })
    try {
        const savedNote = await note.save()
        response.json(savedNote)
    } catch (error) {
        response.status(400).json({ error: error.message })
    }  
})

// DELETE
app.delete('/notes/:id', async (request, response) => {
    try {
        const doc = await Notes.findById(request.params.id)
        if (doc) {
            await doc.deleteOne()
            response.json(doc)
        } else {
            response.status(404).json({ error: "Note not found" })
        }
    } catch (error) {
        response.status(500).json({ error: error.message })
    }
    
})

// PUT
app.put('/notes/:id', async (request, response) => {
    try {
        const updatedDoc = await Notes.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true}
        )
        if (updatedDoc) {
            response.json(updatedDoc)
        } else {
            response.status(404).json({ error: "Note not found"})
        }
    } catch (error) {
        response.status(500).json({ error: error,message })
    }
    
})

app.listen(port, () => {
    console.log('Practice work app listening on port 3000')
})