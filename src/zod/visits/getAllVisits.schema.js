import { z } from "zod";

const getAllVisitsSchema = z.object({
  id: z.uuid(),
  role: z.enum(["patient", "doctor", "finance"]),
});

export { getAllVisitsSchema };
