// const http = require("http");
const express = require("express");
// const fs = require("fs/promises");
const chalk = require("chalk");
const path = require("path");
const { addNote, deleteNote, getNotes } = require("./notes.controller");

const port = 3000;

// const basePath = path.join(__dirname, "pages");

const app = express();
app.set("view engine", "ejs");
app.set("views", "pages");
app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", async (req, res) => {
  console.log(chalk.magenta("GET"));
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
  });
  // res.sendFile(path.join(basePath, "index.html"));
});
app.post("/", async (req, res) => {
  // console.log(req.body.inputText);
  console.log(chalk.magenta("POST"));
  if (req.body.inputText !== undefined && req.body.inputText !== "") {
    await addNote(req.body.inputText);
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      created: true,
    });
  }
  // res.sendFile(path.join(basePath, "index.html"));
});
app.delete("/:id", async (req, res) => {
  console.log(chalk.magenta("DELETE"));
  await deleteNote(req.params.id);
  // console.log(await getNotes());
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
  });
});

app.put("/", async (req, res) => {
  console.log(chalk.magenta("PUT"));
  const tmpBody = req.body;
  console.log(tmpBody);
  if (tmpBody) {
    await deleteNote(tmpBody.id);
    await addNote(tmpBody.newName);
  }
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
  });
});

app.listen(port, () => {
  console.log(chalk.blue(`Server has been started on port ${port}...`));
});
