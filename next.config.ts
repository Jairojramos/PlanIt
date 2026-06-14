// Opt-out Prisma and pg from Turbopack bundling to prevent native bindings resolution errors.

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "pg"],
};

export default nextConfig;