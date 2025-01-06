const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  dateNews: { type: Date },
  category: { type: String},
  language: { type: String },
  author: { type: String },        // New field for author
  image: { type: String },         // New field for image URL
  content: { type: String },       // New field for content
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
