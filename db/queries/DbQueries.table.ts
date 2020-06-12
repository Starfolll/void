import {prisma, Table, TableCreateInput, TableWhereUniqueInput} from "../../generated/prisma-client";


export default class DbQueriesTable {
   public static async IsExists(uniqueInput: TableWhereUniqueInput): Promise<boolean> {
      return await prisma.$exists.table(uniqueInput);
   }

   public static async GetData(uniqueInput: TableWhereUniqueInput): Promise<Table | null> {
      return prisma.table(uniqueInput);
   }

   public static async Create(createInput: TableCreateInput): Promise<void> {
      await prisma.createTable(createInput);
   }

   public static async Delete(uniqueInput: TableWhereUniqueInput): Promise<void> {
      await prisma.deleteTable(uniqueInput);
   }
}
