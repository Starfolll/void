import {DateTimeOutput, ID_Output, Table} from "../../generated/prisma-client";


export default class DbObjectTable implements Table {
   public readonly id: ID_Output;

   public readonly createdAt: DateTimeOutput;
   public readonly updatedAt: DateTimeOutput;


   constructor(tableData: Table) {
      this.id = tableData.id;

      this.updatedAt = tableData.updatedAt;
      this.createdAt = tableData.createdAt;
   }
}
