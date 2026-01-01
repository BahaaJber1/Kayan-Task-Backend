import {} from "dotenv/config";
/* The same as:
  import { config } from "dotenv";
  config();
*/

// Environment Mode
const MODE = process.env.MODE ?? "development";
const FRONTEND_URL_DEV =
  process.env.FRONTEND_URL_DEV ?? "http://localhost:3000";
const FRONTEND_URL_PROD =
  process.env.FRONTEND_URL_PROD ?? "https://your-production-frontend.com";

// Database Settings
const DB_USER = process.env.DB_USER ?? "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD ?? "postgres";
const DB_HOST = process.env.DB_HOST ?? "localhost";
const DB_PORT = process.env.DB_PORT ?? 5432;
const DB_NAME = process.env.DB_NAME ?? "kayan-health";

// Server Settings
const PORT = process.env.PORT ?? 5000;

// JWT Settings
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) ?? 10;
const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "your_default_session_secret";

const databaseSettings = {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
};

const serverSettings = {
  PORT,
  FRONTEND_URL_DEV,
  FRONTEND_URL_PROD,
};

const JWTSettings = {
  SALT_ROUNDS,
  SESSION_SECRET,
};

const environmentMode = {
  MODE,
};

export { databaseSettings, serverSettings, JWTSettings, environmentMode };
