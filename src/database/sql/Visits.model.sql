CREATE TABLE IF NOT EXISTS visits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id uuid REFERENCES users(id),
    doctor_id uuid REFERENCES users(id),
    date TIMESTAMP,
    time VARCHAR(10),
    patient_notes VARCHAR(500) ,
    medical_notes VARCHAR(500),
    status VARCHAR(15) CHECK (status IN ('scheduled', 'completed', 'canceled', 'pending')) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);