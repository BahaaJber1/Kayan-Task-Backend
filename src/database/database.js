import { databaseSettings, environmentMode } from "#config/settings";
import pg from "pg";

const ENVIRONMENT_MODE = environmentMode.MODE;

const databaseDev = new pg.Pool({
  user: databaseSettings.DB_USER,
  host: databaseSettings.DB_HOST,
  database: databaseSettings.DB_NAME,
  password: databaseSettings.DB_PASSWORD,
  port: databaseSettings.DB_PORT,
  // the lines below should be commented when not testing development AND online DB
  ssl: {
    rejectUnauthorized: true,
    ca: databaseSettings.DB_CERT,
  },
});

const databaseProd = new pg.Pool({
  user: databaseSettings.DB_USER,
  host: databaseSettings.DB_HOST,
  database: databaseSettings.DB_NAME,
  password: databaseSettings.DB_PASSWORD,
  port: databaseSettings.DB_PORT,
  ssl: {
    rejectUnauthorized: true,
    ca: databaseSettings.DB_CERT,
  },
});

const database =
  ENVIRONMENT_MODE === "development" ? databaseDev : databaseProd;

await database.query(`
    CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(7) CHECK (role IN ('patient', 'doctor', 'finance')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id uuid REFERENCES users(id) NOT NULL,
    doctor_id uuid REFERENCES users(id) NOT NULL, -- comes from the frontend when select the doctor's name
    date TIMESTAMP,
    time VARCHAR(10),
    patient_notes VARCHAR(500),
    medical_notes VARCHAR(500),
    status VARCHAR(15) CHECK (status IN ('completed', 'cancelled', 'pending', 'active')) DEFAULT 'pending',
    amount SMALLINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS treatments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id uuid REFERENCES visits(id) ON DELETE CASCADE,
    name VARCHAR(20) NOT NULL,
    value SMALLINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

export default database;
