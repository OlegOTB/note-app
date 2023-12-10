const mongoose = require("mongoose")

const noteSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    }
}
)
 const Note = mongoose.model("Note", noteSchema)

 module.exports = Note;