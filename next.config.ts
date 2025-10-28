import withPrisma from "@prisma/nextjs-monorepo-workaround-plugin";
import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin();
const withPrismaPlugin = withPrisma();

export default withPrismaPlugin(withNextIntl(nextConfig));