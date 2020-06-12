import {DateTimeOutput, ID_Output, Lobby} from "../../generated/prisma-client";


export default class DbObjectLobby implements Lobby {
   public readonly id: ID_Output;
   public readonly name: string;

   public readonly createdAt: DateTimeOutput;
   public readonly updatedAt: DateTimeOutput;


   constructor(lobbyData: Lobby) {
      this.id = lobbyData.id;
      this.name = lobbyData.name;

      this.updatedAt = lobbyData.updatedAt;
      this.createdAt = lobbyData.createdAt;
   }
}
