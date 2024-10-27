import z from "zod";

const fileSizeLimit = 5 * 1024 * 1024; // 5MB

export const DOCUMENT_SCHEMA = z
  .object({
    type: z.enum(
      [
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      { message: "Invalid document file type" }
    ),
    size: z.number().max(fileSizeLimit, "File size should not exceed 5MB"),
  })
  .refine((file) => !!file, { message: "File is required" });

export const IMAGE_SCHEMA = z
  .object({
    type: z.enum(
      ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/gif"],
      { message: "Invalid image file type" }
    ),
    size: z.number().max(fileSizeLimit, "File size should not exceed 5MB"),
  })
  .refine((file) => !!file, { message: "File is required" });
