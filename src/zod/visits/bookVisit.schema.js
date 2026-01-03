import { z } from "zod";

const bookVisitSchema = z.object({
  patientId: z.uuid(),
  date: z.date({
    required_error: "Please select a date",
    invalid_type_error: "Invalid date format",
  }),
  notes: z
    .string()
    .min(15, "Notes must be at least 15 characters long")
    .max(500, "Notes cannot exceed 500 characters"),
  time: z.string().min(1, "Please select a time"),
  doctor: z.uuid(),
});

export { bookVisitSchema };
