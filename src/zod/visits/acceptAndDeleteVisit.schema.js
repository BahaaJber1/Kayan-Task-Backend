import { z } from "zod";

const acceptAndDeleteVisitSchema = z.object({
  visitId: z.uuid(),
});

export { acceptAndDeleteVisitSchema };
