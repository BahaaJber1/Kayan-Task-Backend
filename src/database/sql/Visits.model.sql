CREATE TABLE IF NOT EXISTS visits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id uuid REFERENCES users(id) NOT NULL,
    doctor_id uuid REFERENCES users(id) NOT NULL, -- comes from the frontend when select the doctor's name
    date TIMESTAMP,
    time VARCHAR(10),
    patient_notes VARCHAR(500),
    medical_notes VARCHAR(500),
    status VARCHAR(15) CHECK (status IN ('scheduled', 'completed', 'cancelled', 'pending', 'active')) DEFAULT 'pending',
    amount SMALLINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);