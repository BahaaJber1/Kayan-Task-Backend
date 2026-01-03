import database from "#database/database";
import { acceptAndDeleteVisitSchema } from "#zod/visits/acceptAndDeleteVisit.schema";
import { bookVisitSchema } from "#zod/visits/bookVisit.schema";
import { completeVisitSchema } from "#zod/visits/completeVisit.schema";
import { getAllVisitsSchema } from "#zod/visits/getAllVisits.schema";

const bookVisit = async (req, res, next) => {
  const { id: patientId } = req.user;
  const { date, notes, time, doctor } = req.body;

  const parsedResult = bookVisitSchema.safeParse({
    patientId,
    date: new Date(date),
    notes,
    time,
    doctor,
  });

  if (!parsedResult.success) {
    const errorMessage = await JSON.parse(parsedResult.error.message)[0]
      .message;
    return next(new Error(errorMessage));
  }

  const query = `INSERT INTO visits (patient_id, doctor_id, date, time, patient_notes, status) VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`;
  const values = [patientId, doctor, date, time, notes];
  const result = await database.query(query, values);

  if (!result.rows) {
    return next(new Error("Failed to book visit"));
  }

  res
    .status(201)
    .send({ message: "Visit booked successfully", visit: result.rows[0] });
};

const acceptVisit = async (req, res, next) => {
  const parsedResult = acceptAndDeleteVisitSchema.safeParse(req.body);
  if (!parsedResult.success) {
    const errorMessage = await JSON.parse(parsedResult.error.message)[0]
      .message;
    return next(new Error(errorMessage));
  }
  const { visitId } = req.body;

  const result = await database.query(
    `UPDATE visits SET status = 'active' WHERE id = $1 RETURNING *`,
    [visitId]
  );
  if (!result.rows) {
    return next(new Error("Failed to accept visit"));
  }

  res.send({ message: "Visit accepted successfully", visit: result.rows[0] });
};

const completeVisit = async (req, res, next) => {
  const parsedResult = completeVisitSchema.safeParse(req.body);
  if (!parsedResult.success) {
    const errorMessage = await JSON.parse(parsedResult.error.message)[0]
      .message;
    return next(new Error(errorMessage));
  }

  const { visitId, medicalNotes, treatments, amount } = req.body;

  const visitStatus = await database.query(
    `SELECT status FROM visits WHERE id = $1`,
    [visitId]
  );

  // set that after finish testing
  if (visitStatus.rows[0].status === "completed") {
    return next(new Error("Visit already completed"));
  }

  const query = `UPDATE visits SET medical_notes = $1, amount = $2, status = 'completed' WHERE id = $3 RETURNING *`;
  const values = [medicalNotes, amount, visitId];
  const result = await database.query(query, values);
  if (!result.rows) {
    return next(new Error("Failed to accept visit"));
  }

  const queryTreatments = `INSERT INTO treatments (visit_id, name, value) VALUES ($1, $2, $3) RETURNING *`;
  treatments.forEach(async (treatment) => {
    const valuesTreatments = [visitId, treatment.name, treatment.value];
    await database.query(queryTreatments, valuesTreatments);
    if (!result.rows) {
      return next(new Error("Failed to add treatment"));
    }
  });

  res.send({ message: "Visit accepted successfully", visit: result.rows[0] });
};

const getAllVisits = async (req, res, next) => {
  const parsedResult = getAllVisitsSchema.safeParse({ ...req.user });
  if (!parsedResult.success) {
    const errorMessage = await JSON.parse(parsedResult.error.message)[0]
      .message;
    return next(new Error(errorMessage));
  }

  const { id, role } = req.user;

  if (role === "finance") {
    const result = await database.query(`
      SELECT 
        v.*,
        d.name as doctor_name,
        p.name as patient_name
      FROM visits v
      LEFT JOIN users d ON v.doctor_id = d.id
      LEFT JOIN users p ON v.patient_id = p.id
    `);
    if (!result.rows) {
      return next(new Error("Failed to get visits"));
    }
    return res.send({ message: "Success", visits: result.rows });
  }

  let visitQuery = `
    SELECT 
      v.*,
      d.name as doctor_name,
      p.name as patient_name
    FROM visits v
    LEFT JOIN users d ON v.doctor_id = d.id
    LEFT JOIN users p ON v.patient_id = p.id
    WHERE `;

  if (role == "doctor") {
    visitQuery += "v.doctor_id = $1";
  } else if (role === "patient") {
    visitQuery += "v.patient_id = $1";
  }

  const results = await database.query(visitQuery, [id]);
  if (!results.rows) {
    return next(new Error("Failed to get visits"));
  }

  res.send({ message: "Success", visits: results.rows });
};

export { acceptVisit, bookVisit, completeVisit, getAllVisits };
