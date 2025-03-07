import { z } from "zod";

export const FormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "min_title_warning" })
    .max(20, { message: "max_title_warning" }),
  description: z
    .string()
    .min(10, { message: "min_description_warning" })
    .max(100, { message: "max_description_warning" }),
});
