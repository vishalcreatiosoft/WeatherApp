const value = require('../app');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;



const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'Weather';

MongoClient.connect(connectionURL, {useNewUrlParser : true, useUnifiedTopology : true}, (error, client)=>{
    if(error){
        return console.log("unable to connect to database!");
    }

    const db = client.db(databaseName);
    console.log('connect');

})
