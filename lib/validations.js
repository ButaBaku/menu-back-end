import { z } from "zod";

export const userSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Title must be string",
    })
    .email("Invalid email format"),

  password: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Title must be string",
    })
    .min(8, "Password must be at least 8 characters"),
});

export const categorySchema = z.object({
  titleEN: z
    .string({
      required_error: "Title EN is required",
      invalid_type_error: "Title must be string",
    })
    .min(1, "Title EN must be provided"),

  titleAZ: z
    .string({
      required_error: "Title AZ is required",
      invalid_type_error: "Title must be string",
    })
    .min(1, "Title AZ must be provided"),
});

export const subCategorySchema = z.object({
  titleEN: z
    .string({
      required_error: "Title EN is required",
      invalid_type_error: "Title must be string",
    })
    .min(1, "Title EN must be provided"),

  titleAZ: z
    .string({
      required_error: "Title AZ is required",
      invalid_type_error: "Title must be string",
    })
    .min(1, "Title AZ must be provided"),

  categoryId: z
    .number({
      required_error: "Category ID is required",
      invalid_type_error: "Category ID must be number",
    })
    .int(),
});

export const productSchema = z.object({
  titleEN: z
    .string({
      required_error: "Title EN is required",
      invalid_type_error: "Title must be string",
    })
    .min(1, "Title EN must be provided"),

  titleAZ: z
    .string({
      required_error: "Title AZ is required",
      invalid_type_error: "Title must be string",
    })
    .min(1, "Title AZ must be provided"),

  descEN: z
    .string({
      required_error: "Description EN is required",
      invalid_type_error: "Description must be string",
    })
    .min(1, "Description EN must be provided"),

  descAZ: z
    .string({
      required_error: "Description AZ is required",
      invalid_type_error: "Description must be string",
    })
    .min(1, "Description AZ must be provided"),

  gram: z
    .string({
      required_error: "Gram is required",
      invalid_type_error: "Gram must be string",
    })
    .min(1, "Gram must be provided"),

  subCategoryId: z
    .number({
      required_error: "SubCategory ID is required",
      invalid_type_error: "SubCategory ID must be number",
    })
    .int(),
});
