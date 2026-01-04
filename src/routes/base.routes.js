import database from "#database/database";
import { Router } from "express";

const baseRouter = Router();

baseRouter.get("/success", async (req, res, next) => {
  console.log({ id: req.sessionID, reqSession: req.session });
  const sess = {
    cookie: req.session.cookie,
    passport: req.session.passport,
  };
  console.log({ sess });
  // const sessionData = await database.query(
  //   `INSERT INTO session (sid, sess, expire) VALUES ($1, $2, $3) RETURNING *`,
  //   [req.sessionID, sess, req.session.cookie.expires]
  // );

  // const result = await database.query(`SELECT * FROM session`);
  // const sessionData = result.rows;
  // console.log({ sessionData });
  // user = {
  //   role: sessionData,
  // };

  res.send({ message: "Login successful, welcome in." });
});

baseRouter.get("/failure", (req, res, next) => {
  res.status(401).send({
    message: "signin failed, try again.",
    reason: "Invalid credentials.",
  });
});

export default baseRouter;
