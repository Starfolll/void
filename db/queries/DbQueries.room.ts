import {prisma, Room, RoomCreateInput, RoomWhereUniqueInput} from "../../generated/prisma-client";


export default class DbQueriesRoom {
   public static async IsExists(uniqueInput: RoomWhereUniqueInput): Promise<boolean> {
      return await prisma.$exists.room(uniqueInput);
   }

   public static async GetData(uniqueInput: RoomWhereUniqueInput): Promise<Room | null> {
      return prisma.room(uniqueInput);
   }

   public static async Create(createInput: RoomCreateInput): Promise<void> {
      await prisma.createRoom(createInput);
   }

   public static async Delete(uniqueInput: RoomWhereUniqueInput): Promise<void> {
      await prisma.deleteRoom(uniqueInput);
   }
}
