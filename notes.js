const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// ✅ Serve static files (index.html, his.html, CSS, etc.)
app.use(express.static(__dirname));
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/notesapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Define Note schema + model
const noteSchema = new mongoose.Schema({
  topic: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Note = mongoose.model('Note', noteSchema);

// ✅ Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Serve history page
app.get("/history", (req, res) => {
  res.sendFile(path.join(__dirname, "his.html"));
});

// ✅ POST: Save note
app.post("/notes", async (req, res) => {
  const { topic, content } = req.body;
  if (!topic || !content) {
    return res.status(400).send("Topic and content are required");
  }
  const newNote = new Note({ topic, content });
  await newNote.save();
  res.send("Note saved.");
});

// ✅ GET: All notes for history page
app.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// ✅ Start server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
