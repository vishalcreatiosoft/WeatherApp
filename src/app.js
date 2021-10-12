const request = require('request');
const express = require('express');
const path = require('path');
const hbs = require('hbs')
const searchData = require('./models/search_data')


require('./database/connection');

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

app.post('/search_data', async(req, res)=>{
    try{
        
        const location = req.body.cityName;
        const url = `http://api.weatherstack.com/current?access_key=b85fd43d4d3a4047c747405c6cb25e2e&query=${location}`

        request({url: url},(error, response)=>{
            const data = JSON.parse(response.body)
            console.log(data)
            
            //res.write(data);
            res.render("home",{title : response.body});



        })
    }catch(error){
        res.status(400).send(error);
    }

})




// const location = 'Mumbai';

// const url = `http://api.weatherstack.com/current?access_key=b85fd43d4d3a4047c747405c6cb25e2e&query=${location}`

// request({url: url},(error, response)=>{
//     const data = JSON.parse(response.body)
//     console.log(data)
// })


app.listen(port,()=>{
    console.log(`server is running on port no ${port}`);
})