// src/users/dto/create-user.dto.ts
import { z } from 'zod';

export const CreateOrganizationDtoSchema = z.object({
  code: z.string(),
  name: z.string(),
  phone: z.string(),
});

// Inferred TypeScript type
export type CreateOrganizationDto = z.infer<typeof CreateOrganizationDtoSchema>;
