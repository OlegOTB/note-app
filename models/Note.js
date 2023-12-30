const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  testDataVersion: String,
  title: String,
  chesk:
    Number /* 0 - тест не открывался; number - кол-во верных ответов в % от общего кол-ва ответов*/,
  quastionsList: [
    {
      num: String,
      title: String,
      chesk:
        Number /*-1 - дан неверный ответ; 0 - не было ответа; 1 - дан верный ответ*/,
      answer: [{ num: String, title: String, chesk: Boolean }],
    },
  ],
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
