const request = require('request');
const express = require('express');
const path = require('path');
const isOnline = require('is-online')

const hbs = require('hbs');
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

require('./database/connection');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'Weather';

const app = express();
const port = process.env.PORT || 3000;

const public_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
app.set('views', views_path);
hbs.registerPartials(partials_path);


app.use(express.static(public_path));
app.set("view engine", "hbs");
app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.get('/',(req, res)=>{
    res.render("index");
})

app.get('/home',(req, res)=>{
    res.render("home");
})

app.post('/home', async(req, res)=>{
    try{
        
        const checkConnection = async(rq, re)=>{
            var result = await isOnline();
            //console.log(result);

            if(result){
                const location = req.body.cityName;

                const url = `http://api.weatherstack.com/current?access_key=5b8a3c041a96a0ee70ea4a9729fa883e&query=${location}`

                request({url: url},(error, response)=>{
                
                    // storing whole json body into data variable
                    const data = JSON.parse(response.body)
                
                    const saveData = {
                        country : data.location.country,
                        city : data.location.name,
                        region : data.location.region,
                        observation_time : data.current.observation_time,
                        humidity : data.current.humidity

                    }              

                    MongoClient.connect(connectionURL, {useNewUrlParser : true, useUnifiedTopology : true}, (error, client)=>{
                    if(error){
                        return console.log("unable to connect to database!");
                    }

                    const db = client.db(databaseName);
                    //console.log('connect');
                    db.collection('Data').insertOne(saveData);
                    })
                    res.render("home", saveData);
                        
                })

            }
            else{
                res.status(400).send("No Internet Connection");
            }


        }
        checkConnection();



        
    }catch(error){
        res.status(400).send(error);
    }


})


app.post('/offlineSearch', async(req, res)=>{
    const searchCity = req.body.cityInformation;

    MongoClient.connect(connectionURL, {useNewUrlParser : true, useUnifiedTopology : true}, (error, client)=>{
        if(error){
            return console.log("unable to connect to database while fetching !");
        }

        const db = client.db(databaseName);
        //console.log('connected');
                
        db.collection('Data').find({city : searchCity}).toArray((err,resultData)=>{
            if(err){
                console.log(err);
            }
            
            const resultString = JSON.stringify(resultData)       
           // console.log(resultString);   
            
            res.render("offlineSearch",{title : resultString});
            
        }); 
     
        
              
    })

        

})


app.listen(port,()=>{
    console.log(`server is running on port no ${port}`);
})


