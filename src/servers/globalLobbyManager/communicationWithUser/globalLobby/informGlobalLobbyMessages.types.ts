import {extendedLobbyData} from "../../../../../db/objects/DbObject.lobby";
import {chatMessageInfo} from "../../../utils/chat/chatMessage";
import {extendedRoomData} from "../../../../../db/objects/DbObject.room";

export type redirectToGameTable = {
   messageType: string;
   tableId: string;
}

export type redirectToRoom = {
   messageType: string;
   roomData: extendedRoomData;
}

export type globalLobbyInfo = {
   messageType: string;
   lobbyData: extendedLobbyData;
}

export type newLobbyChatMessage = {
   messageType: string;
   message: chatMessageInfo;
}

export type friendConnectedToLobby = {
   messageType: string;
   friendId: string;
}

export type friendDisconnectedFromLobby = {
   messageType: string;
   friendId: string;
}

export type friendsConnectedToGame = {
   messageType: string;
   friendsId: Array<string>;
}

export type inviteToRoom = {
   messageType: string;
   userId: string;
   roomId: string;
}
