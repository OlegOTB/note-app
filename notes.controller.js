// const fs = require("fs/promises");
// const path = require("path");
const chalk = require("chalk");
const Note = require("./models/Note");
const displayDate = require("./utils/displayDate");

// const notesPath = path.join(__dirname, "db.json");

async function addNote(title, idArr, typeRecord) {
  //   const notes = require(notesPath);
  //   const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  //   const notes = Buffer.from(buffer).toString("utf-8");
  switch (typeRecord) {
    case "test": {
      title.num = Date.now();
      title.version = displayDate(title.num);
      await Note.create(title);
      console.log(
        chalk.green(`Тест версии от ${title.version} добавлен в базу данных!`)
      );
      break;
    }
    case "quastion": {
      const buff = await Note.findById(idArr[0]);
      buff.quastionsList.push(title);
      await buff.save();
      console.log(
        chalk.green(`Вопрос добавлен в тест версии от ${buff.version}!`)
      );
      break;
    }
    case "answer": {
      const buff = await Note.findById(idArr[0]);
      buff.quastionsList.id(idArr[1]).answer.push(title);
      await buff.save();
      console.log(
        chalk.green(
          `Ответ добавлен к вопросу с id:${idArr[1]} в тест версии от ${buff.version}!`
        )
      );
      break;
    }
    default:
      console.log(
        chalk.red("Попытка добавить запись несоответствующую схеме данных!")
      );
      return;
  }
  // const notes = await getNotes();
  // const note = {
  //   title,
  //   id: Date.now().toString(),
  // };
  // notes.push(note);
  // await fs.writeFile(notesPath, JSON.stringify(notes));
  // console.log(chalk.green("Note was added!"));
}

async function deleteNote(idArr, typeRecord) {
  // const notes = await getNotes();
  switch (typeRecord) {
    case "test": {
      const buff = await Note.findById(idArr[0]);
      await Note.deleteOne({ _id: idArr[0] });
      console.log(
        chalk.red(`Тест версии от ${buff.version} удален из базы данных!`)
      );
      break;
    }
    case "quastion": {
      const buff = await Note.findById(idArr[0]);
      for (let i = 0; i < buff.quastionsList.length; i++) {
        if (buff.quastionsList[i].id === idArr[1]) {
          buff.quastionsList[i] = buff.quastionsList[0];
          buff.quastionsList.shift();
          break;
        }
      }
      await buff.save();
      console.log(
        chalk.red(
          `Вопрос с id:${idArr[1]} удален из теста версии от ${buff.version}!`
        )
      );
      break;
    }
    case "answer": {
      const buff = await Note.findOne({ _id: idArr[0] });
      const buffArr = buff.quastionsList.id(idArr[1]);
      for (let i = 0; i < buffArr.answer.length; i++) {
        if (buffArr.answer[i].id === idArr[2]) {
          buffArr.answer[i] = buffArr.answer[0];
          buffArr.answer.shift();
          break;
        }
      }
      await buff.save();
      console.log(
        chalk.red(
          `Ответ с id:${idArr[2]} удален из ответов к вопросу с id:${idArr[1]} в тесте версии от ${buff.version}!`
        )
      );
      break;
    }
    default:
      console.log(
        chalk.red("Попытка удалить запись несоответствующую схеме данных!")
      );
      return;
  }
  //   console.log(id);
  //   console.log(notes);
  // const newNotes = notes.filter((note) => note.id !== id);
  // await fs.writeFile(notesPath, JSON.stringify(newNotes));
  // console.log(chalk.red(`Запись удалена!`));
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

async function updateNote(title, idArr, typeRecord) {
  // const notes = await getNotes();
  // const index = notes.findIndex((note) => note.id === id);
  // notes[index].title = title;
  // await fs.writeFile(notesPath, JSON.stringify(notes));
  switch (typeRecord) {
    case "test": {
      await Note.updateOne({ _id: idArr[0] }, { $set: { title: title.title } });
      console.log(chalk.blue(`Название теста с id:${idArr[0]} обновлено!`));
      break;
    }
    case "quastion": {
      const buff = await Note.findById(idArr[0]);
      buff.quastionsList.id(idArr[1]).title = title.title;
      buff.quastionsList.id(idArr[1]).num = title.num;
      await buff.save();
      console.log(
        chalk.blue(`Вопрос с id:${idArr[1]} в тесте с id:${idArr[0]} обновлен!`)
      );
      break;
    }
    case "answer": {
      const buff = await Note.findById(idArr[0]);
      buff.quastionsList.id(idArr[1]).answer.id(idArr[2]).title = title.title;
      buff.quastionsList.id(idArr[1]).answer.id(idArr[2]).num = title.num;
      buff.quastionsList.id(idArr[1]).answer.id(idArr[2]).chesk = title.chesk;
      console.log(
        chalk.blue(
          `Ответ с id:${idArr[2]} на вопрос с id:${idArr[1]} в тесте с id:${idArr[0]} обновлен!`
        )
      );
      await buff.save();
      break;
    }
    default:
      console.log(
        chalk.red("Попытка обновить запись несоответствующую схеме данных!")
      );
      return;
  }
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
};
