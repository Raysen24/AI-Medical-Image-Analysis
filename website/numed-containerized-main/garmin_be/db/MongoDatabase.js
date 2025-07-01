import { MongoClient } from "mongodb";

// uri deploy
// const uri = "mongodb://108.136.227.7:27017";

// uri local
// const uri = "mongodb://localhost:27017";

// Bryn's Mongo Atlass Cluster
// const username = "numed-garmin";
// const password = "Shale-Filtrate7-Drone";
// const uri = `mongodb+srv://${username}:${password}@cluster0.fb4hf.mongodb.net/test?authMechanism=DEFAULT`;

const uri = "mongodb://mongo:27017";

const mongoClient = new MongoClient(uri);

const numedDatabase = mongoClient.db("garmin");
export const pulseOxCollection = numedDatabase.collection("pulseOx");
export const heartRateCollection = numedDatabase.collection("heartRate");
export const respirationCollection = numedDatabase.collection("respiration");
