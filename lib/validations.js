import { z } from "zod";

export const userSchema = z.object({
  email: z
    .string({
      required_error: "Email tələb olunur",
      invalid_type_error: "Email mətn olmalıdır",
    })
    .email("Yanlış email formatı"),

  password: z
    .string({
      required_error: "Şifrə tələb olunur",
      invalid_type_error: "Şifrə mətn olmalıdır",
    })
    .min(8, "Şifrə ən az 8 simvoldan ibarət olmalıdır"),
});

export const categorySchema = z.object({
  titleEN: z
    .string({
      required_error: "İngilis dilində başlıq tələb olunur",
      invalid_type_error: "Başlıq mətn olmalıdır",
    })
    .min(1, "İngilis dilində başlıq təqdim edilməlidir"),

  titleAZ: z
    .string({
      required_error: "Azərbaycanca başlıq tələb olunur",
      invalid_type_error: "Başlıq mətn olmalıdır",
    })
    .min(1, "Azərbaycanca başlıq təqdim edilməlidir"),

  position: z.number({
    required_error: "Sıra nömrəsi tələb olunur",
    invalid_type_error: "Sıra nömrəsi rəqəm olmalıdır",
  }),
});

export const subCategorySchema = z.object({
  titleEN: z
    .string({
      required_error: "İngilis dilində alt kateqoriya başlığı tələb olunur",
      invalid_type_error: "Başlıq mətn olmalıdır",
    })
    .min(1, "İngilis dilində alt kateqoriya başlığı təqdim edilməlidir"),

  titleAZ: z
    .string({
      required_error: "Azərbaycanca alt kateqoriya başlığı tələb olunur",
      invalid_type_error: "Başlıq mətn olmalıdır",
    })
    .min(1, "Azərbaycanca alt kateqoriya başlığı təqdim edilməlidir"),

  position: z.number({
    required_error: "Sıra nömrəsi tələb olunur",
    invalid_type_error: "Sıra nömrəsi rəqəm olmalıdır",
  }),

  categoryId: z
    .number({
      required_error: "Kateqoriya ID-si tələb olunur",
      invalid_type_error: "Kateqoriya ID-si rəqəm olmalıdır",
    })
    .int(),
});

export const productSchema = z.object({
  titleEN: z
    .string({
      required_error: "İngilis dilində məhsul başlığı tələb olunur",
      invalid_type_error: "Başlıq mətn olmalıdır",
    })
    .min(1, "İngilis dilində məhsul başlığı təqdim edilməlidir"),

  titleAZ: z
    .string({
      required_error: "Azərbaycanca məhsul başlığı tələb olunur",
      invalid_type_error: "Başlıq mətn olmalıdır",
    })
    .min(1, "Azərbaycanca məhsul başlığı təqdim edilməlidir"),

  price: z
    .string({
      required_error: "Qiymət tələb olunur",
      invalid_type_error: "Qiymət mətn olmalıdır",
    })
    .min(1, "Qiymət tələb olunur"),

  subCategoryId: z
    .number({
      required_error: "Alt kateqoriya ID-si tələb olunur",
      invalid_type_error: "Alt kateqoriya ID-si rəqəm olmalıdır",
    })
    .int(),
});

export const campaignSchema = z.object({
  titleEN: z
    .string({
      required_error: "İngilis dilində kampaniya başlığı tələb olunur",
      invalid_type_error: "Başlıq mətn olmalıdır",
    })
    .min(1, "İngilis dilində kampaniya başlığı təqdim edilməlidir"),

  titleAZ: z
    .string({
      required_error: "Azərbaycanca kampaniya başlığı tələb olunur",
      invalid_type_error: "Başlıq mətn olmalıdır",
    })
    .min(1, "Azərbaycanca kampaniya başlığı təqdim edilməlidir"),
});
