const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1yvmtut.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const quizDataCollection = client
      .db('ictContestQuiz')
      .collection('quizUserData');
    app.post('/addUserQuizData', async (req, res) => {
      const quizData = req.body;
      const count = await quizDataCollection.estimatedDocumentCount();
      req.body.count = count + 1;
      console.log(quizData);
      const result = await quizDataCollection.insertOne(quizData);
      res.send(result);
    });
    app.get('/getUserQuizData', async (req, res) => {
      const result = await quizDataCollection
        .find()
        .sort({ count: -1 })
        .toArray();
      res.send(result);
    });

    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('quiz is running');
});
app.listen(port);
