import { prisma } from "../../../generated/prisma-client";

export default {
  Query: {
    allUsers: (_, args) => {
      return prisma.users();
    },
  },
  Mutation: {
    createAccount: async (_, args) => {
      const { name, email, avatar, bio } = args;
      const nameExist = await prisma.$exists.user({ name });
      if (nameExist) {
        throw Error("name is already taken!");
      }
      const emailExist = await prisma.$exists.user({ email });
      if (emailExist) {
        throw Error("email is already taken!");
      }
      try {
        await prisma.createUser({ name, email, avatar, bio });
        return true;
      } catch (error) {
        return false;
      }
    },
    editUser: async (_, args, { request, isAuth }) => {
      isAuth(request);
      const user = request.user;
      const { avatar, firstName, lastName, bio } = args;
      try {
        const res = await prisma.updateUser({
          where: { id: user.id },
          data: { avatar, firstName, lastName, bio },
        });
        return true;
      } catch (error) {
        return false;
      }
    },
  },
};
