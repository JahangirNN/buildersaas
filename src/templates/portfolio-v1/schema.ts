import { z } from 'zod';

export const portfolioSchema = z.object({
  name: z.string().default('Portfolio'),
  THEME_COLOR: z.string().default('#CA8A04'),
  LOGO_TEXT: z.string().optional(),
  HERO_HEADLINE: z.string().default('Welcome to my world.'),
  SUB_HEADLINE: z.string().default('Discover the best works.'),
  ABOUT_SECTION: z.string().default('An expert in my field.'),
  ABOUT_TITLE: z.string().default('Every story is a journey.'),
  CTA_PRIMARY_TEXT: z.string().default('Discover Works'),
  CTA_SECONDARY_TEXT: z.string().default('My Philosophy'),
  CTA_NAV_TEXT: z.string().default('Author Booking'),
  WHATSAPP_LINK: z.string().default('#'),
  STAT_1_VAL: z.string().default('03'),
  STAT_1_LABEL: z.string().default('Published Epics'),
  STAT_2_VAL: z.string().default('100+'),
  STAT_2_LABEL: z.string().default('Cult Followers'),
  STAT_3_VAL: z.string().default('14'),
  STAT_3_LABEL: z.string().default('Lost Stories'),
  FOOTER_LOGO: z.string().optional(),
  FOOTER_CREDITS: z.string().optional(),
  PRODUCT_LIST: z.array(z.object({
    name: z.string().default('Sample Work'),
    desc: z.string().default('A sample description.'),
    price: z.string().default('Custom'),
    image_url: z.string().optional(),
  })).default([]),
}).passthrough();

export type PortfolioData = z.infer<typeof portfolioSchema>;
