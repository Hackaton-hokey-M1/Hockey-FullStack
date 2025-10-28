declare module '@prisma/nextjs-monorepo-workaround-plugin' {
  import type { NextConfig } from 'next';
  export default function withPrisma(): (config?: NextConfig) => NextConfig;
}