import {DateTimeOutput, Float, ID_Output, Int, User} from "../../generated/prisma-client";

export default class DbObjectUser implements User {
   public readonly id: ID_Output;
   public readonly name: string;
   public readonly email: string;
   public readonly password: string;

   public readonly publicName: string;
   public readonly token: string;

   public readonly isVerified: boolean;

   public readonly avatarUrlHash?: string;
   public readonly changPasswordHash?: string;
   public readonly verificationLink?: string;

   public readonly xp: Float;
   public readonly gold: Float;
   public readonly lvl: Int;

   public readonly updatedAt: DateTimeOutput;
   public readonly createdAt: DateTimeOutput;


   constructor(userData: User) {
      this.id = userData.id;
      this.name = userData.name;
      this.email = userData.email;
      this.password = userData.password;

      this.publicName = userData.publicName;
      this.token = userData.token;

      this.isVerified = userData.isVerified;

      this.avatarUrlHash = userData.avatarUrlHash;
      this.changPasswordHash = userData.changPasswordHash;
      this.verificationLink = userData.verificationLink;

      this.xp = userData.xp;
      this.gold = userData.gold;
      this.lvl = userData.lvl;

      this.updatedAt = userData.updatedAt;
      this.createdAt = userData.createdAt;
   }
}
