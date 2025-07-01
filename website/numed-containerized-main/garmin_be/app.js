import express from 'express';
import 'dotenv/config';
import { authRoute } from './client/auth/router.js'; 
import { healthRouter } from './client/health/HealthRouter.js';
import cors from 'cors';
import { testingRouter } from './testing_endpoints/TestingRouter.js';

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cors({ credentials: true, origin: true }));
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Headers", "Set-Cookie");
//     next();
// })

app.get('/alive', (req, res) => {
    res.send("Numed Garmin API is now live!");
});

app.use('/auth', authRoute);
app.use('/health', healthRouter);
app.use('/testing', testingRouter);

const PORT = process.env.PORT || 80

app.listen(PORT, () => {
    console.log(`Numed Garmin API is live at port ${PORT}`);
});