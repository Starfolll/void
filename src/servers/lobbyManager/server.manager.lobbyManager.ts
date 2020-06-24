import ManagerLobby from "./manager.lobby";


(async () => {
   const managerLobby = new ManagerLobby({
      server: {},
      lobby: {}
   });

   await managerLobby.Setup();
   await managerLobby.Boot();
})();
