import "dotenv/config";
import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_URL,
  },
});
