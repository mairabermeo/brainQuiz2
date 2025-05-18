const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const dbURL = process.env.ATLAS_URI;
let db = null;

async function connectToDB() {
  try {
    const client = new MongoClient(dbURL, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      tls: true,
      tlsAllowInvalidCertificates: true, 
    });

    await client.connect();
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
    await client.db("admin").command({ ping: 1 });
    db = client.db("brainQuiz");
    console.log("Database reference set to 'brainQuiz'");
  } 
  catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw new Error('Database connection failed');
  }
}

function getCollection(collectionName) {
  if (!db) {
    console.error(`Database not initialized. Collection ${collectionName} cannot be accessed.`);
    throw new Error('Database connection not established. Call connectToDB first.');
  }

  console.log(`Accessing collection: ${collectionName}`);
  return db.collection(collectionName);
}

module.exports = {
  connectToDB,
  getCollection,
};