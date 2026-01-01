import database from "#database/database";

const bookVisit = (req, res, next) => {
  const {
    patient: { name },
    date,
    notes,
  } = req.body;
  const query = `INSERT INTO visits (date, patient_notes) VALUES ($1, $2) RETURNING *`;
  const values = [date, notes];
  database.query(query, values, (err, result) => {
    if (err) {
      return next(new Error(err.message));
    }
    if (!result.rows) {
      return next(new Error("Failed to book visit"));
    }
    res.status(201).json({ visit: result.rows[0] });
  });
};

export { bookVisit };
