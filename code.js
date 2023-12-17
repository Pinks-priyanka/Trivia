const express = require("express");
const app = express();
const axios = require('axios');
const path = require("path");
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(express.static('public'))
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const uri = process.env.MONGO_CONNECTION_STRING;
const databaseAndCollection = { db: "finalProject", collection: "scores" };
const { MongoClient, ServerApiVersion } = require("mongodb");
const { clear } = require("console");
let client;
async function main() {
  client = new MongoClient(uri);
  try {
    await client.connect();
  } catch (e) {
    console.log(e);
  }
}

main().catch(console.error);


async function insert(client, collection, values) {
    await client
      .db(collection.db)
      .collection(collection.collection)
      .insertOne(values);
  }

  async function lookup(client, collection, name) {
    let filter = { username:  name};
    const val = await client
      .db(collection.db)
      .collection(collection.collection)
      .findOne(filter);
    return val;
  }

app.get("/",(req,res) =>{
    res.render("index");
});

app.post("/home", async(req,res)=>{
    const variables = {
        username:req.body.username,
        password: req.body.password
    };
    let val = await lookup(client, databaseAndCollection, req.body.username);
    if(!val){
        await insert(client, databaseAndCollection, variables);
    }
    res.render("home");
});

app.get('/home2',(req,res)=>{
    res.render('home');
});

app.get("/trivia",async(req,res)=>{  
    let result = await fetch('https://opentdb.com/api.php?amount=5&type=boolean');
    let json  = await result.json();
    const variables = {
        one:json.results[0].question,
        two:json.results[1].question,
        three:json.results[2].question,
        four:json.results[3].question,
        five:json.results[4].question    }
    res.render("trivia",variables);
});

app.get("/score",(req,res)=>{

    const variables={
        score: '5!!! :)'
    }
    res.render("score",variables);
});

console.log(`Image Web server is running at http://localhost:5500`);
app.listen(5500);




