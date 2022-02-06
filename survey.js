const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
    user_id: {type:String},
    username:{type:String},
    question: {type:String},
    answer:[],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('survey', SurveySchema);