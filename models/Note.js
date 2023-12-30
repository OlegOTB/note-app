const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  testDataVersion: String,
  testTitle: String,
  quastionsList: [
    {
      id: String,
      num: String,
      title: String,
      quastAnsChesk:
        Number /*-1 - дан неверный ответ; 0 - не было ответа; 1 - дан верный ответ*/,
      answer: [
        { ansId: String, ansNum: String, ansTitle: String, anschesk: Boolean },
      ],
    },
  ],
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
