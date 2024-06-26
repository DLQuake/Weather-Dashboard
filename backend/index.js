import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/Database.js';
import SequelizeStore from 'connect-session-sequelize';
import UserRoute from './routes/UserRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import WeatherDataRoute from "./routes/WeatherDataRoute.js";
import LocationRoute from "./routes/LocationRoute.js";
import ForecastRoute from "./routes/ForecastRoute.js";
import ReportRoute from "./routes/ReportRoute.js";
import cron from 'node-cron';
import { saveTodayWeatherData } from './controllers/WeatherData.js';

dotenv.config();

const app = express();

const sessionStore = new SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

// (async()=>{
// await db.sync();
// })();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(UserRoute);
app.use(AuthRoute);
app.use(LocationRoute);
app.use(WeatherDataRoute);
app.use(ForecastRoute);
app.use(ReportRoute);

// store.sync();

cron.schedule('15 13 * * *', async () => {
    try {
        await saveTodayWeatherData();
        console.log('Downloaded and saved today API data.');
    } catch (error) {
        console.error('Error downloading and saving today API data:', error);
    }
});

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running on http://localhost:%d/', process.env.APP_PORT);
})