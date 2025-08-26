const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);


const soundByteSchema = new mongoose.Schema(
    {
        artist: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        album: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
            required: true,
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comments: [commentSchema],
    },
    { timestamps: true }
);

const SoundByte = mongoose.model('SoundByte', soundByteSchema);

module.exports = SoundByte;