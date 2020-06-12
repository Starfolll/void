import {DateTimeOutput, ID_Output, Room} from "../../generated/prisma-client";


export default class DbObjectRoom implements Room {
   public readonly id: ID_Output;
   public readonly isPublic: boolean;

   public readonly updatedAt: DateTimeOutput;
   public readonly createdAt: DateTimeOutput;


   constructor(roomData: Room) {
      this.id = roomData.id;
      this.isPublic = roomData.isPublic;

      this.updatedAt = roomData.updatedAt;
      this.createdAt = roomData.createdAt;
   }
}
