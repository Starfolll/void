import dotenv from "dotenv";
import {Prisma} from "../generated/prisma-client";


dotenv.config();
export default class EnvPrisma {
   private static readonly prismaSecret = process.env.PRISMA_SECRET;
   private static readonly prismaEndpoint = `http://localhost:4466`;

   public static readonly prisma = new Prisma({
      ...Prisma,
      secret: EnvPrisma.prismaSecret,
      endpoint: EnvPrisma.prismaEndpoint
   });
}
