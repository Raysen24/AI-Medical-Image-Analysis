import { Router } from "express";
import { pulseOxCollection } from "../db/MongoDatabase.js";

export const testingRouter = Router();

testingRouter.post("/db-insert", ({ body }, res) => {
    pulseOxCollection.insertOne(body)
        .then((db_res) => {
            console.log(db_res);
            return res.status(200).json(db_res).send();
            
        })
        .catch((db_err) => {
            console.log(err);
            return res.status(200).json(db_err).send();
        });
});