import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config(); // load .env

export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts"
  }
});
