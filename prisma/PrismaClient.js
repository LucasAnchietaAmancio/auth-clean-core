import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const client = new PrismaClient();

export default client;