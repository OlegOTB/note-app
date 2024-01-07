// const http = require("http");
const express = require("express");
// const fs = require("fs/promises");
const chalk = require("chalk");
const mongoose = require("mongoose");
const Note = require("./models/Note");
const path = require("path");
const dbConfig = require("./config/db.config");
const initData = require("./mockData/initData.json");

const {
  updateNote,
  addNote,
  deleteNote,
  getNotes,
  getNoteById,
} = require("./notes.controller");

const port = 3000;
let idTest;
let maxNum;
let version;

// const basePath = path.join(__dirname, "pages");

const app = express();
app.set("view engine", "ejs");
app.set("views", "pages");
app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/test", async (req, res) => {
  console.log(chalk.magenta("GET"));
  res.render("testPage", {
    title: "Тест ver." + version,
    idTest: idTest,
  });
});

app.get("/test/result", async (req, res) => {
  console.log(chalk.magenta("GET"));
  res.render("resultPage", {
    title: "Результат прохождения теста ver." + version,
    idTest: idTest,
  });
});

app.get("/test/edit", async (req, res) => {
  console.log(chalk.magenta("GET"));
  res.render("editPage", {
    title: "Тест ver." + version,
    idTest: idTest,
  });
});

app.get("/test/:id", async (req, res) => {
  console.log(chalk.magenta("GET"));
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(JSON.stringify(await getNoteById(req.params.id)));
});
app.get("/test/edit/:id", async (req, res) => {
  console.log(chalk.magenta("GET"));
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(JSON.stringify(await getNoteById(req.params.id)));
});
app.get("/", async (req, res) => {
  console.log(chalk.magenta("GET"));
  res.render("mainPage", {
    title: "Тест ver." + version,
  });
  // res.sendFile(path.join(basePath, "index.html"));
});
app.post("/test/edit", async (req, res) => {
  // console.log(req.body.inputText);
  console.log(chalk.magenta("POST"));
  try {
    if (req.body.inputText !== undefined && req.body.inputText !== "") {
      await addNote(req.body.inputText);
      res.render("editPage", {
        test: await getNoteById(idTest),
      });
    }
  } catch (error) {
    console.error("Creation error", error);
    res.render("editPage", {
      test: await getNoteById(idTest),
    });
  } // res.sendFile(path.join(basePath, "index.html"));
});
app.delete("/test/edit", async (req, res) => {
  console.log(chalk.magenta("DELETE"));
  await deleteNote(req.params.id);
  // console.log(await getNotes());
  res.render("editPage", {
    test: await getNoteById(idTest),
  });
});

app.put("/test/edit", async (req, res) => {
  console.log(chalk.magenta("PUT"));
  const tmpBody = req.body;
  console.log(tmpBody);
  if (tmpBody) {
    await updateNote(tmpBody.id, tmpBody.newName);
  }
  res.render("editPage", {
    test: await getNoteById(idTest),
  });
});

async function initDataTest() {
  const notes = await Note.find({}, { num: 1 });
  let buff;
  if (notes.length > 0) {
    maxNum = Math.max(...notes.map((data) => data.num));
  } else {
    await addNote(initData, [], "test");
    maxNum = initData.num;
  }
  buff = await Note.findOne({ num: maxNum }, { id: 1, version: 1 });
  version = buff.version;
  return buff.id;
}

mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
  .then(async () => {
    app.listen(port, () => {
      console.log(chalk.blue(`Server has been started on port ${port}...`));
    });
    idTest = await initDataTest();
  });
