import { z } from 'zod';

export const portfolioV3Schema = z.object({
  name: z.string().default('Studio Blanc'),
  THEME_COLOR: z.string().default('#1a1a1a'),
  TAGLINE: z.string().default('Visual Storytelling Studio'),
  HERO_HEADLINE: z.string().default('We craft images\\nthat stop the scroll.'),
  SUB_HEADLINE: z.string().default('A boutique creative studio specializing in photography, brand films, and visual identity for forward-thinking brands.'),
  ABOUT_SECTION: z.string().default('Founded in 2019, Studio Blanc has partnered with over 80 brands across fashion, hospitality, and lifestyle sectors to produce imagery that sells.'),
  ABOUT_IMAGE: z.string().default(''),
  HERO_BG_IMAGE: z.string().default(''),
  CTA_PRIMARY_TEXT: z.string().default('Start a Project'),
  CTA_SECONDARY_TEXT: z.string().default('View Portfolio'),
  WHATSAPP_LINK: z.string().default('#'),
  STAT_1_VAL: z.string().default('80+'),
  STAT_1_LABEL: z.string().default('Brand Partners'),
  STAT_2_VAL: z.string().default('5'),
  STAT_2_LABEL: z.string().default('Years Active'),
  STAT_3_VAL: z.string().default('12'),
  STAT_3_LABEL: z.string().default('Awards Won'),
  PRODUCT_LIST: z.array(z.object({
    name: z.string().default('Untitled Project'),
    desc: z.string().default('A beautiful visual project.'),
    price: z.string().default('View'),
    image_url: z.string().optional(),
  })).default([]),
}).passthrough();

export type PortfolioV3Data = z.infer<typeof portfolioV3Schema>;
