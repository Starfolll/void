import {prisma, User, UserCreateInput, UserUpdateInput, UserWhereUniqueInput} from "../../generated/prisma-client";


export default class DbQueriesUser {
   public static async IsExists(uniqueInput: UserWhereUniqueInput): Promise<boolean> {
      return await prisma.$exists.user(uniqueInput);
   }

   public static async GetData(uniqueInput: UserWhereUniqueInput): Promise<User | null> {
      return prisma.user(uniqueInput);
   }

   public static async Create(createInput: UserCreateInput): Promise<void> {
      await prisma.createUser(createInput);
   }

   public static async Delete(uniqueInput: UserWhereUniqueInput): Promise<void> {
      await prisma.deleteUser(uniqueInput);
   }

   public static async Update(uniqueInput: UserWhereUniqueInput, input: UserUpdateInput): Promise<void> {
      await prisma.updateUser({data: input, where: uniqueInput});
   }
}
