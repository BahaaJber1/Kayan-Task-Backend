import { databaseSettings } from "#config/settings";
import pg from "pg";

const database = new pg.Pool({
  user: databaseSettings.DB_USER,
  host: databaseSettings.DB_HOST,
  database: databaseSettings.DB_NAME,
  password: databaseSettings.DB_PASSWORD,
  port: databaseSettings.DB_PORT,
});

export default database;
