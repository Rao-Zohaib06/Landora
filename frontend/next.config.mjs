import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fix Turbopack workspace root detection (Windows often has multiple lockfiles).
  // Ensures Next uses `frontend/` as the root, so `.env.local` is loaded from the correct folder.
  turbopack: {
    root: __dirname,
  },
  images: {
    domains: [],
  },
};

export default nextConfig;


