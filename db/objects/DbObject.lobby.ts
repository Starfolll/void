import {DateTimeOutput, ID_Output, Lobby, LobbyStatus} from "../../generated/prisma-client";


export default class DbObjectLobby implements Lobby {
   public readonly id: ID_Output;
   public readonly createdAt: DateTimeOutput;
   public readonly status: LobbyStatus;


   constructor(lobbyData: Lobby) {
      this.id = lobbyData.id;
      this.status = lobbyData.status;
      this.createdAt = lobbyData.createdAt;
   }
}
