const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  num: String,
  version: String,
  title: String,
  quastionsList: [
    {
      num: String,
      title: String,
      answer: [
        {
          num: String,
          title: String,
          chesk:
            Number /*number - верный ответ в частях от общего кол-ва верных ответов (если верный ответ 1 ответ то chesk=1); 0 - неверный ответ*/,
        },
      ],
    },
  ],
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;

/*chesk: Number  0 - тест не открывался; number - кол-во верных ответов в % от общего кол-ва ответов*/
/*quastionsList: chesk: Number -1 - не было ответа; number - сумма частей верных ответов (0 - дан неверный ответ)*/
