import { portfolioV1Template } from '@/templates/portfolio-v1/template';
import { ecommerceV1Template } from '@/templates/ecommerce-v1/template';

export interface TemplateData {
  name: string;
  type: string;
  whatsapp_number: string;
  WHATSAPP_LINK?: string;
  HERO_HEADLINE?: string;
  SUB_HEADLINE?: string;
  ABOUT_SECTION?: string;
  THEME_COLOR?: string;
  PRODUCT_LIST?: Array<{
    name: string;
    desc: string;
    price: string;
    image_url: string;
  }>;
}

export function renderTemplate(templateName: string, data: TemplateData): string {
  switch (templateName) {
    case 'portfolio-v1':
      return portfolioV1Template(data);
    
    case 'ecommerce-v1':
      return ecommerceV1Template(data);
    
    default:
      // Fallback
      return portfolioV1Template(data);
  }
}
