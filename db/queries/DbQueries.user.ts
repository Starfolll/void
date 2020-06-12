import {prisma, Table, UserCreateInput, UserWhereUniqueInput} from "../../generated/prisma-client";


export default class DbQueriesUser {
   public static async IsExists(uniqueInput: UserWhereUniqueInput): Promise<boolean> {
      return await prisma.$exists.user(uniqueInput);
   }

   public static async GetData(uniqueInput: UserWhereUniqueInput): Promise<Table | null> {
      return prisma.user(uniqueInput);
   }

   public static async Create(createInput: UserCreateInput): Promise<void> {
      await prisma.createUser(createInput);
   }

   public static async Delete(uniqueInput: UserWhereUniqueInput): Promise<void> {
      await prisma.deleteUser(uniqueInput);
   }
}
