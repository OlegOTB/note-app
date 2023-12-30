// const fs = require("fs/promises");
// const path = require("path");
const chalk = require("chalk");
const Note = require("./models/Note");

// const notesPath = path.join(__dirname, "db.json");

async function addTest(test) {
  await Note.create(test);
  console.log(chalk.green("Test was added!"));
}

async function addNote(title) {
  //   const notes = require(notesPath);
  //   const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  //   const notes = Buffer.from(buffer).toString("utf-8");
  await Note.create({ title });
  // const notes = await getNotes();
  // const note = {
  //   title,
  //   id: Date.now().toString(),
  // };
  // notes.push(note);
  // await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log(chalk.green("Note was added!"));
}

async function deleteNote(id) {
  // const notes = await getNotes();
  await Note.deleteOne({ _id: id });
  //   console.log(id);
  //   console.log(notes);
  // const newNotes = notes.filter((note) => note.id !== id);
  // await fs.writeFile(notesPath, JSON.stringify(newNotes));
  console.log(chalk.red(`Note by id: ${id} was deleted!`));
}

async function getNoteById(id) {
  const notes = await Note.findById(id);
  return notes;
}

async function getNotes() {
  //   return require(notesPath);
  // const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  const notes = await Note.find();
  // return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
  return notes;
}

async function updateNote(id, title) {
  // const notes = await getNotes();
  // const index = notes.findIndex((note) => note.id === id);
  // notes[index].title = title;
  // await fs.writeFile(notesPath, JSON.stringify(notes));
  await Note.updateOne({ _id: id }, { title: title });
  console.log(chalk.blue(`Note by id: ${id} updated!`));
}

async function printNotes() {
  const notes = await getNotes();
  console.log(chalk.blue("Here is the list of notes:"));
  notes.forEach((note) => {
    console.log(chalk.green(note.id, " ", note.title));
  });
}

module.exports = {
  updateNote,
  addNote,
  printNotes,
  deleteNote,
  getNotes,
  getNoteById,
  addTest,
};
