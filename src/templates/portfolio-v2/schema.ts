import { z } from 'zod';

export const portfolioV2Schema = z.object({
  name: z.string().default('Alex Morgan'),
  THEME_COLOR: z.string().default('#6366f1'),
  ROLE_TITLE: z.string().default('Full-Stack Designer & Consultant'),
  HERO_HEADLINE: z.string().default('I help brands\\nbuild digital presence\\nthat converts.'),
  SUB_HEADLINE: z.string().default('Senior product designer with 7+ years crafting high-converting digital experiences for startups and Fortune 500 companies.'),
  ABOUT_SECTION: z.string().default('I believe great design is invisible — it just works. My process combines deep user research, rapid prototyping, and pixel-perfect execution to deliver results that matter.'),
  PROFILE_IMAGE: z.string().default(''),
  CTA_PRIMARY_TEXT: z.string().default('Book a Free Call'),
  CTA_SECONDARY_TEXT: z.string().default('See My Work'),
  WHATSAPP_LINK: z.string().default('#'),
  STAT_1_VAL: z.string().default('7+'),
  STAT_1_LABEL: z.string().default('Years Experience'),
  STAT_2_VAL: z.string().default('120+'),
  STAT_2_LABEL: z.string().default('Clients Served'),
  STAT_3_VAL: z.string().default('98%'),
  STAT_3_LABEL: z.string().default('Satisfaction Rate'),
  REVIEW_1_TEXT: z.string().default('Working with Alex was transformative. Our conversion rates jumped 40% after the redesign.'),
  REVIEW_1_AUTHOR: z.string().default('Sarah K., CEO of Luminary'),
  REVIEW_2_TEXT: z.string().default('Delivered on time, on budget, and above expectations. The best investment we made this year.'),
  REVIEW_2_AUTHOR: z.string().default('James T., Founder of Nova Labs'),
  PRODUCT_LIST: z.array(z.object({
    name: z.string().default('Brand Strategy'),
    desc: z.string().default('Complete brand positioning, visual identity, and messaging framework.'),
    price: z.string().default('₹25,000'),
    image_url: z.string().optional(),
  })).default([]),
}).passthrough();

export type PortfolioV2Data = z.infer<typeof portfolioV2Schema>;
