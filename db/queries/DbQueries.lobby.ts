import {Lobby, LobbyCreateInput, LobbyWhereUniqueInput, prisma} from "../../generated/prisma-client";


export default class DbQueriesLobby {

   public static async IsExists(uniqueInput: LobbyWhereUniqueInput): Promise<boolean> {
      return await prisma.$exists.lobby(uniqueInput);
   }

   public static async GetData(uniqueInput: LobbyWhereUniqueInput): Promise<Lobby | null> {
      return prisma.lobby(uniqueInput);
   };

   public static async Create(createInput: LobbyCreateInput): Promise<void> {
      await prisma.createLobby(createInput);
   };

   public static async Delete(uniqueInput: LobbyWhereUniqueInput): Promise<void> {
      await prisma.deleteLobby(uniqueInput);
   };
}
