import { z } from "zod"

export const registerSchema = z.object({
  username: z.string().min(8, "Username at least 8 characters").max(20, "Username too long"),
  email: z.string().email("Invalid email"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  dob: z.object({
    day: z.string().min(1, "Day required"),
    month: z.string().min(1, "Month required"),
    year: z.string().min(4, "Year required").max(4, "Invalid year"),
  }).refine((data) => {
    const { day, month, year } = data;
    const date = new Date(`${year}-${month}-${day}`);
    return date instanceof Date && !isNaN(date.getTime()) && date <= new Date();
  }, {
    message: "Invalid date of birth",
    path: ["dob"],
  }),
  password: z.string().min(8, "Password too short").max(20, "Password too long"),
})

export type RegisterFormData = z.infer<typeof registerSchema>

