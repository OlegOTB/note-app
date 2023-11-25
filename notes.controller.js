const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const notesPath = path.join(__dirname, "db.json");

async function addNote(title) {
  //   const notes = require(notesPath);
  //   const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  //   const notes = Buffer.from(buffer).toString("utf-8");

  const notes = await getNotes();
  const note = {
    title,
    id: Date.now().toString(),
  };
  notes.push(note);
  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log(chalk.green("Note was added!"));
}

async function deleteNote(id) {
  const notes = await getNotes();
  //   console.log(id);
  //   console.log(notes);
  if (notes.find((note) => note.id === id)) {
    const newNotes = notes.filter((note) => note.id !== id);
    //   console.log(newNotes);

    await fs.writeFile(notesPath, JSON.stringify(newNotes));
    console.log(chalk.red(`Note by id: ${id} was deleted!`));
  } else {
    console.log(chalk.red(`Note by id: ${id} not found`));
  }
}

async function getNotes() {
  //   return require(notesPath);
  const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function printNotes() {
  const notes = await getNotes();
  console.log(chalk.blue("Here is the list of notes:"));
  notes.forEach((note) => {
    console.log(chalk.green(note.id, " ", note.title));
  });
}

module.exports = {
  addNote,
  printNotes,
  deleteNote,
};
