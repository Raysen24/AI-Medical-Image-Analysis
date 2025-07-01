import { Router } from "express";
import { heartRateCollection, pulseOxCollection, respirationCollection } from "../../db/MongoDatabase.js";
import { GarminClient } from "../GarminClient.js";

export const healthRouter = Router();

healthRouter.post('/ping', async ({ body }, res) => {
    console.log("A ping has taken place!!");
    console.log(`Ping occured at ${new Date().toLocaleTimeString()}`)
    console.log(body);
    res.status(200).send("PING OK");
});

healthRouter.post('/push/dailies', async ({ body }, res) => {
    console.log("[dailies] notification has been received");
    console.log(`[dailies] notification received at ${new Date().toISOString()}`);
    const { dailies } = body;
    dailies.forEach(async daily_data => {

        // Data sent from notification
        const { 
           timeOffsetHeartRateSamples: hr_data, 
           startTimeInSeconds,
           userAccessToken,
           userId,
        } = daily_data;

        // Data insertion optimization to insert only missing values to the database
        const cursor = heartRateCollection.find().sort({"_id": -1}).limit(1);
        const timestamps = await cursor.map(doc => doc._id).toArray();
        const maxTimestamp = timestamps[0] ? timestamps[0] : 0;

        // Transform data into documents
        const docs = Object.entries(hr_data)
            .filter(([offset, _]) => { // insertion optimization
                const timestamp = startTimeInSeconds + parseInt(offset);
                return timestamp > maxTimestamp;
            })
            .map(([offset, hr]) => {
                const timestamp = startTimeInSeconds + parseInt(offset);
                const date = new Date(timestamp * 1000);
                return ({
                    "_id": timestamp,
                    "userId": userId,
                    "userAccessToken": userAccessToken,
                    date: date.toISOString(),
                    "heartRate": hr
                });
            });

        // Insert documents into database
        try {
            if (docs.length > 0) {
                const { insertedCount: count } = await heartRateCollection.insertMany(docs);
                console.log(`[dailies] ${count} values have been inserted into the database!`);
            } else {
                const count = 0;
                console.log(`[dailies] ${count} values have been inserted into the database!`);
            }
        } catch (e) {
            console.log("[dailies] An error occurred when inserting into the database");
            console.log(e);
        } 
    });
    return res.status(200).send("dailies notificaton has been received");
});

healthRouter.post("/push/pulseOx", async ({ body }, res) => {
    console.log("[pulseOx] notification has been received");
    console.log(`[pulseOx] notification received at ${new Date().toISOString()}`);
    const { pulseox } = body;
    // const [firstData, _] = pulseox;
    pulseox.forEach(async pulseox_data => {
        const { 
            startTimeInSeconds: measure_start,
            timeOffsetSpo2Values,
            userId,
            userAccessToken,
         } = pulseox_data;
        const cursor = pulseOxCollection.find().sort({"_id": -1}).limit(1);
        const timestamps = await cursor.map(doc => doc._id).toArray();
        const maxTimestamp = timestamps[0] ? timestamps[0] : 0;
        const docs = Object.entries(timeOffsetSpo2Values)
                        .filter(([offset, _]) => {
                            const timestamp = measure_start + parseInt(offset);
                            return timestamp > maxTimestamp; 
                        })
                        .map(([offset, pulseOx]) => {
                            const timestamp = measure_start + parseInt(offset);
                            const date = new Date(timestamp * 1000);
                            return ({
                                _id: timestamp,
                                userId: userId,
                                date: date.toISOString(),
                                userAccessToken: userAccessToken,
                                pulseOx: pulseOx
                            });
                        });
        try {
            if (docs.length > 0) {
                const { insertedCount: count } = await pulseOxCollection.insertMany(docs);
                console.log(`[pulseOx] ${count} values have been inserted into the database!`);
            } else {
                const count = 0;
                console.log(`[pulseOx] ${count} values have been inserted into the database!`);
            }
        } catch (e) {
            console.log("[pulseOx] An error occurred when inserting into the databse");
            console.log(e);
        }
    });
    return res.status(200).send("pulseOx notification has been received");
});

healthRouter.post("/push/respiration", async ({ body }, res) => {
    console.log("[respiration] notification has been received");
    console.log(`[respiration] notification received at ${new Date().toISOString()}`);
    const { 
        allDayRespiration: respiration,
    } = body;
    respiration.forEach(async resp => {
        const cursor = respirationCollection.find().sort({"_id": -1}).limit(1);
        const data = await cursor.map(doc => doc._id).toArray();
        const maxTimestamp = data[0] ? data[0] : 0;
        const {
            userId, userAccessToken,
            startTimeInSeconds: measure_start,
            timeOffsetEpochToBreaths: resp_data
        } = resp;
        const docs = Object.entries(resp_data)
            .filter(([key, _]) => {
                const timestamp = measure_start + parseInt(key);
                return timestamp > maxTimestamp;
            })
            .map(([key, value]) => {
                const timestamp = measure_start + parseInt(key);
                const date = new Date(timestamp * 1000);
                return ({
                    "_id": timestamp,
                    "userId": userId,
                    "userAccessToken": userAccessToken,
                    "date": date.toISOString(),
                    "respiration": value,
                });
            })
        try {
            if (docs.length > 0) {
                const { insertedCount: count } = await respirationCollection.insertMany(docs);
                console.log(`[respiration] ${count} values have been inserted into the database!`);                    
            } else {
                const count = 0;
                console.log(`[respiration] ${count} values have been inserted into the database!`);                    
            }
        } catch (e) {
            console.log("[respiration] An error occurred when inserting into the database!");
            console.log(e);
        }
    })
    return res.status(200).send("Respiration notification has been received!");

});

const getBounds = ((measure_start, measure_end) => {
    let bounds = {};
    if (measure_start || measure_end) {
        bounds["_id"] = {};
    }

    if (measure_start) {
        bounds._id = {
            ...bounds._id,
            $gte: parseInt(measure_start)
        }
    }

    if (measure_end) {
        bounds._id = {
            ...bounds._id,
            $lte: parseInt(measure_end)
        }
    }
    return bounds;
});

healthRouter.get('/pulseOx/:user_access_token', async ({ params, query }, res, next) => {
    const { user_access_token } = params;
    const { measure_start, measure_end } = query;

    const cursor = pulseOxCollection.find({
        ...getBounds(measure_start, measure_end),
        userAccessToken: user_access_token
    }).sort({"_id": 1});
    const res_body = await cursor
        .map(doc => ({timestamp: doc._id, date: doc.date, pulseOx: doc.pulseOx}))
        .toArray();
    res.status(200).json(res_body);
    return next();
});

healthRouter.get('/respiration/:user_access_token', async ({ params, query }, res, next) => {
    const { user_access_token } = params;
    const { measure_start, measure_end, } = query;

    const cursor = respirationCollection.find({
        ...getBounds(measure_start, measure_end),
        userAccessToken: user_access_token,
    }).sort({"_id": 1});
    const res_body = await cursor
        .map(doc => ({timestamp: doc._id, date: doc.date, respiration: doc.respiration}))
        .toArray();
    res.status(200).json(res_body);
    return next();
});

healthRouter.get("/heartRate/:user_access_token", async ({ params, query }, res, next) => {
    const { user_access_token } = params;
    const { measure_start, measure_end } = query;
    const cursor = heartRateCollection.find({
        ...getBounds(measure_start, measure_end),
        userAccessToken: user_access_token,
    }).sort({"_id": 1});
    const res_body = await cursor
        .map(doc => ({"timestamp": doc._id, "date": doc.date, "heartRate": doc.heartRate}))
        .toArray();
    res.status(200).json(res_body);
    return next();
});