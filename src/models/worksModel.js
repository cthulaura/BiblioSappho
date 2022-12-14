const mongoose = require('mongoose');

const workSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: mongoose.Types.ObjectId
        },
        title: { type: String, required: true },
        author: String,
        genre: { type: String, required: true },
        medium: { 
            type: String, 
            required: true,
            enum: ['game', 'book', 'movie', 'series', 'animation', 'comic'] },
        plot: { type: String, default: "Empty." },
        comments: { type: String, default: "Empty." },
        queerRepresentation: { 
            type: String, 
            required: true,
            enum: ['lesbian', 'sapphic'] },
        isFavorite: { type: Boolean, default: false },
        registeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        } 
    },
    { versionKey: false }
)

const workModel = mongoose.model("Work", workSchema);

module.exports = workModel;