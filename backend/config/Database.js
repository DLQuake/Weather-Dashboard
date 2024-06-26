import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
        ssl: process.env.DB_SSL_REQUIRE === 'true'
    }
});

export default db;
