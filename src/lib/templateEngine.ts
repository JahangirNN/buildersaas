import { TemplateRegistry } from '@/templates/registry';

export function renderTemplate(templateId: string, rawData: unknown): string {
  // Use Registry to find template
  const template = TemplateRegistry[templateId] || TemplateRegistry['portfolio-v1'];
  
  // Validate and apply defaults via Zod
  const result = template.schema.safeParse(rawData);
  const validatedData = result.success ? result.data : rawData;

  return template.render(validatedData);
}
