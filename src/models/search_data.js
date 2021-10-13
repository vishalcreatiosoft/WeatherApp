const mongoose = require('mongoose');

const searchCity = new mongoose.Schema({

    cityName : {
        type : String,
        required : true
    }
})

 //const searchData = new mongoose.model("Weather", searchCity);

 //module.exports = searchData;

