import { portfolioV1Template } from './portfolio-v1/template';
import { ecommerceV1Template } from './ecommerce-v1/template';
import { portfolioSchema } from './portfolio-v1/schema';
import { ecommerceSchema } from './ecommerce-v1/schema';
import { Template } from './types';

export const TemplateRegistry: Record<string, Template> = {
  'portfolio-v1': {
    id: 'portfolio-v1',
    name: 'Modern Portfolio',
    schema: portfolioSchema,
    render: (data) => portfolioV1Template(data as import('./portfolio-v1/schema').PortfolioData),
  },
  'ecommerce-v1': {
    id: 'ecommerce-v1',
    name: 'Nature Ecommerce',
    schema: ecommerceSchema,
    render: (data) => ecommerceV1Template(data as import('./ecommerce-v1/schema').EcommerceData),
  },
};

// Aliases for legacy database support
TemplateRegistry['portfolio'] = TemplateRegistry['portfolio-v1'];
TemplateRegistry['ecommerce'] = TemplateRegistry['ecommerce-v1'];
