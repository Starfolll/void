import {chatMessageInfo} from "../../../utils/chat/chatMessage";
import {userPublicData} from "../../../../../db/objects/DbObject.user";
import {extendedRoomData, roomData} from "../../../../../db/objects/DbObject.room";

export type newRoomChatMessage = {
    messageType: string;
    message: chatMessageInfo;
}

export type userConnectedToRoom = {
    messageType: string;
    user: userPublicData;
}

export type userRemovedFromRoom = {
    messageType: string;
    userId: string;
}

export type gameStart = {
    messageType: string;
    tableId: string;
}

export type privateRoomCreated = {
    messageType: string;
    roomData: extendedRoomData;
}

export type newRoomCreator = {
    messageType: string;
    creatorId: string;
}
