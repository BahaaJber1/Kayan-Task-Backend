import database from "#database/database";

const getAllDoctors = async (req, res, next) => {
  const result = await database.query(
    `SELECT id, name FROM users WHERE role = 'doctor'`
  );

  if (!result.rows) {
    return next(new Error("No doctors found"));
  }

  res.send({ message: "Success", doctors: result.rows });
};

export { getAllDoctors };
