import withPrismaPlugin from "@prisma/nextjs-monorepo-workaround-plugin";
import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";


const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin();

export default withPrismaPlugin(withNextIntl(nextConfig));
