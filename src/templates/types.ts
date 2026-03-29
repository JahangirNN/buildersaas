import { z } from 'zod';

export interface Template {
  id: string;
  name: string;
  schema: z.ZodTypeAny;
  render: (data: unknown) => string;
}

export type TemplateRegistryData = Record<string, Template>;
