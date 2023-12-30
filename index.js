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
  addTest,
} = require("./notes.controller");

const port = 3000;

// const basePath = path.join(__dirname, "pages");

const app = express();
app.set("view engine", "ejs");
app.set("views", "pages");
app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get("/", async (req, res) => {
  console.log(chalk.magenta("GET"));
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
    error: false,
  });
  // res.sendFile(path.join(basePath, "index.html"));
});
app.post("/", async (req, res) => {
  // console.log(req.body.inputText);
  console.log(chalk.magenta("POST"));
  try {
    if (req.body.inputText !== undefined && req.body.inputText !== "") {
      await addNote(req.body.inputText);
      res.render("index", {
        title: "Express App",
        notes: await getNotes(),
        created: true,
        error: false,
      });
    }
  } catch (error) {
    console.error("Creation error", error);
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      created: false,
      error: true,
    });
  } // res.sendFile(path.join(basePath, "index.html"));
});
app.delete("/:id", async (req, res) => {
  console.log(chalk.magenta("DELETE"));
  await deleteNote(req.params.id);
  // console.log(await getNotes());
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
    error: false,
  });
});

app.put("/", async (req, res) => {
  console.log(chalk.magenta("PUT"));
  const tmpBody = req.body;
  console.log(tmpBody);
  if (tmpBody) {
    await updateNote(tmpBody.id, tmpBody.newName);
  }
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
    error: false,
  });
});

async function initDataTest() {
  const notes = await getNotes();
  if (notes.length > 0) {
    let maxTestDataVersion = Math.max(
      ...notes.map((data) => data.testDataVersion)
    );
    return notes.find((item) => item.testDataVersion === maxTestDataVersion);
  } else {
    await addTest(initData);
  }
}

mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
  .then(async () => {
    app.listen(port, () => {
      console.log(chalk.blue(`Server has been started on port ${port}...`));
    });
    await initDataTest();
  });
