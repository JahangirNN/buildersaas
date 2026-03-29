import { portfolioV1Template } from './portfolio-v1/template';
import { ecommerceV1Template } from './ecommerce-v1/template';
import { portfolioV2Template } from './portfolio-v2/template';
import { portfolioV3Template } from './portfolio-v3/template';
import { portfolioV4Template } from './portfolio-v4/template';
import { portfolioSchema } from './portfolio-v1/schema';
import { ecommerceSchema } from './ecommerce-v1/schema';
import { portfolioV2Schema } from './portfolio-v2/schema';
import { portfolioV3Schema } from './portfolio-v3/schema';
import { portfolioV4Schema } from './portfolio-v4/schema';
import { Template } from './types';

export const TemplateRegistry: Record<string, Template> = {
  'portfolio-v1': {
    id: 'portfolio-v1',
    name: 'Portfolio Noir',
    schema: portfolioSchema,
    render: (data) => portfolioV1Template(data as import('./portfolio-v1/schema').PortfolioData),
  },
  'portfolio-v2': {
    id: 'portfolio-v2',
    name: 'Glassmorphism Pro',
    schema: portfolioV2Schema,
    render: (data) => portfolioV2Template(data as import('./portfolio-v2/schema').PortfolioV2Data),
  },
  'portfolio-v3': {
    id: 'portfolio-v3',
    name: 'Minimal Studio',
    schema: portfolioV3Schema,
    render: (data) => portfolioV3Template(data as import('./portfolio-v3/schema').PortfolioV3Data),
  },
  'portfolio-v4': {
    id: 'portfolio-v4',
    name: 'Dev Terminal',
    schema: portfolioV4Schema,
    render: (data) => portfolioV4Template(data as import('./portfolio-v4/schema').PortfolioV4Data),
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

