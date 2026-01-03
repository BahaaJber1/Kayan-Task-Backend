import { z } from "zod";

const completeVisitSchema = z.object({
  visitId: z.uuid(),
  medicalNotes: z
    .string()
    .min(15, "Medical notes must be at least 15 characters long")
    .max(500, "Medical notes cannot exceed 500 characters"),
  treatments: z.array(
    z.object({
      name: z.optional(
        z
          .string()
          .min(3, "Treatment name must be at least 3 characters")
          .max(20, "Treatment name must be at most 20 characters")
          .regex(
            /^[a-zA-Z\s]+$/,
            "Treatment name must contain only letters and spaces"
          )
      ),
      value: z.coerce
        .number({ invalid_type_error: "Value must be a number" })
        .min(1, "Value must be at least 1")
        .max(1000, "Value must be at most 1000"),
    })
  ),
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .min(0, "Amount cannot be negative")
    .max(10000, "Amount cannot exceed 10000"),
});

export { completeVisitSchema };
