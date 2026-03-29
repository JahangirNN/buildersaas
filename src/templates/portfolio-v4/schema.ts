import { z } from 'zod';

export const portfolioV4Schema = z.object({
  name: z.string().default('dev.rajan'),
  THEME_COLOR: z.string().default('#22d3ee'),
  ROLE_TITLE: z.string().default('Full-Stack Engineer & Open Source Contributor'),
  HERO_HEADLINE: z.string().default('Building systems\\nthat scale to millions.'),
  SUB_HEADLINE: z.string().default('I architect and build robust backend systems, developer tools, and high-performance web applications. Currently open to remote opportunities.'),
  ABOUT_SECTION: z.string().default('5+ years working across the full stack — from React frontends to distributed Go microservices. I love clean code, interesting problems, and shipping things people actually use.'),
  STACK_TAGS: z.string().default('TypeScript, React, Next.js, Go, PostgreSQL, Redis, Docker, AWS'),
  GITHUB_LINK: z.string().default('#'),
  LINKEDIN_LINK: z.string().default('#'),
  CTA_PRIMARY_TEXT: z.string().default('Hire Me'),
  CTA_SECONDARY_TEXT: z.string().default('View GitHub'),
  WHATSAPP_LINK: z.string().default('#'),
  STAT_1_VAL: z.string().default('5+'),
  STAT_1_LABEL: z.string().default('Years Coding'),
  STAT_2_VAL: z.string().default('40k+'),
  STAT_2_LABEL: z.string().default('GitHub Stars'),
  STAT_3_VAL: z.string().default('15+'),
  STAT_3_LABEL: z.string().default('OSS Projects'),
  PRODUCT_LIST: z.array(z.object({
    name: z.string().default('Project Name'),
    desc: z.string().default('A cool open source project.'),
    price: z.string().default('Open Source'),
    image_url: z.string().optional(),
  })).default([]),
}).passthrough();

export type PortfolioV4Data = z.infer<typeof portfolioV4Schema>;
