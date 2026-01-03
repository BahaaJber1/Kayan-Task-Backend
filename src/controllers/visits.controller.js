import database from "#database/database";
import { acceptAndDeleteVisitSchema } from "#zod/visits/acceptAndDeleteVisit.schema";
import { bookVisitSchema } from "#zod/visits/bookVisit.schema";
import { completeVisitSchema } from "#zod/visits/completeVisit.schema";
import { getAllVisitsSchema } from "#zod/visits/getAllVisits.schema";

const bookVisit = async (req, res, next) => {
  if (req.user.role !== "patient") {
    return next(new Error("Only patients can book visits"));
  }

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

  if (req.user.role !== "doctor") {
    return next(new Error("Only doctors can accept visits"));
  }

  const { visitId } = req.body;
  const { id: doctorId } = req.user;

  // Check if doctor already has a scheduled visit
  const activeVisit = await database.query(
    `SELECT id FROM visits WHERE doctor_id = $1 AND status = 'active'`,
    [doctorId]
  );

  if (activeVisit.rows.length > 0) {
    return next(
      new Error(
        "You already have an active visit. Please complete it before accepting a new one."
      )
    );
  }

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

  if (req.user.role !== "doctor") {
    return next(new Error("Only doctors can complete visits"));
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

const cancelVisit = async (req, res, next) => {
  if (req.user.role !== "patient" && req.user.role !== "doctor") {
    return next(new Error("Only patients or doctors can cancel visits"));
  }

  const parsedResult = acceptAndDeleteVisitSchema.safeParse(req.body);
  if (!parsedResult.success) {
    const errorMessage = await JSON.parse(parsedResult.error.message)[0]
      .message;
    return next(new Error(errorMessage));
  }

  const { visitId } = req.body;

  const result = await database.query(
    `UPDATE visits SET status = 'cancelled' WHERE id = $1 RETURNING *`,
    [visitId]
  );
  if (!result.rows) {
    return next(new Error("Failed to cancel visit"));
  }
  res.send({ message: "Visit cancelled successfully", visit: result.rows[0] });
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
        p.name as patient_name,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name, 'value', t.value)
          ) FILTER (WHERE t.id IS NOT NULL), 
          '[]'
        ) as treatments
      FROM visits v
      LEFT JOIN users d ON v.doctor_id = d.id
      LEFT JOIN users p ON v.patient_id = p.id
      LEFT JOIN treatments t ON v.id = t.visit_id
      GROUP BY v.id, d.name, p.name
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
      p.name as patient_name,
      COALESCE(
        json_agg(
          json_build_object('id', t.id, 'name', t.name, 'value', t.value)
        ) FILTER (WHERE t.id IS NOT NULL), 
        '[]'
      ) as treatments
    FROM visits v
    LEFT JOIN users d ON v.doctor_id = d.id
    LEFT JOIN users p ON v.patient_id = p.id
    LEFT JOIN treatments t ON v.id = t.visit_id
    WHERE `;

  if (role == "doctor") {
    visitQuery += "v.doctor_id = $1";
  } else if (role === "patient") {
    visitQuery += "v.patient_id = $1";
  }

  visitQuery += " GROUP BY v.id, d.name, p.name";

  const results = await database.query(visitQuery, [id]);
  if (!results.rows) {
    return next(new Error("Failed to get visits"));
  }

  res.send({ message: "Success", visits: results.rows });
};

export { acceptVisit, bookVisit, completeVisit, cancelVisit, getAllVisits };
