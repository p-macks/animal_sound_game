import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "AnimalDB",
  password: "P@tIeNt19084",
  port: 5432,
});

db.connect();


let quiz = [
  { animal: "donkey", sound: "brays" },
  { animal: "cow", sound: "moos" },
  { animal: "snake", sound: "hisses" },
];

db.query("SELECT * FROM animals", (err, res) => {
  if(err){
  console.error("Error executing query", err.stack);
  }else{
  quiz=res.rows;
  }
  db.end();
});

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.sound.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomAnimal = quiz[Math.floor(Math.random() * quiz.length)];

  currentQuestion = randomAnimal;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
