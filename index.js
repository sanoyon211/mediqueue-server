const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const tutorsRouter = require('./routes/tutors');
const bookingsRouter = require('./routes/bookings');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log('✅ MongoDB Connected!');

    // Collections
    const db = client.db('mediqueue');
    const tutorsCollection = db.collection('tutors');
    const bookingsCollection = db.collection('bookings');

    // Routes
    app.use('/tutors', tutorsRouter(tutorsCollection));
    app.use('/bookings', bookingsRouter(bookingsCollection));

    // Root route
    app.get('/', (req, res) => {
      res.send('MediQueue Server is Running! 🚀');
    });
  } catch (error) {
    console.log(error);
  }
}

run();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// 7zCfeLBWkN0V3tTg
// mediqueue
