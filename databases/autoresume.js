const mongoose = require('mongoose')

const autoresume = new mongoose.Schema({
    guild: String,
    voiceChannel: String,
    textChannel: String,
    queue: Object,
    current: Object,
    volume: String,
    queueRepeat: Boolean,
    trackRepeat: Boolean,
    playing: Boolean,
    position: String,
    eq: String,
    filter: String,
    filtervalue: String,
    autoplay: Boolean,
})

module.exports = mongoose.model("autoresume", autoresume);