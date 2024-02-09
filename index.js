// importing modules
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


// setting server port for express server
const port = 3000;
const app = express()

// using middleware
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "2012",
  port: 5432
});

db.connect();
let quiz = [ ];
db.query("SELECT * FROM flags", (err, res)=>{
  if(err){
    console.error("Error executing query:", err.stack);
  } else {
    quiz = res.rows
  }
})

let totalCorrect = 0;
let currentQuestion = { };
// setting up home route
app.get("/", async (req, res)=>{
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs",{
    question: currentQuestion
  })
});

app.post("/submit", (req, res)=>{
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if(currentQuestion.country.toLowerCase() === answer.toLowerCase()){
    totalCorrect ++;
    console.log(totalCorrect);
    isCorrect = true;
  }
  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    totalScore: totalCorrect,
    wasCorrect: isCorrect,
  });

});
async function nextQuestion(){
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

app.listen(port, ()=>{
  console.log(`Server running on port: ${port}`);
});