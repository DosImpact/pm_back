import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    follow: async (_, arg, { request, isAuth }) => {
      isAuth(request);
      const { id: youid } = arg;
      try {
        const me = request.user;
        const youexists = await prisma.$exists.user({ youid });
        if (youexists) {
          throw Error("can't find following user");
        }
        await prisma.updateUser({
          where: { id: me },
          data: {
            following: {
              connect: { id: youid },
            },
          },
        });
      } catch (error) {
        throw Error("can't follow : error", error);
      }
    },
    unfollow: (_, arg, { request, isAuth }) => {},
  },
};
