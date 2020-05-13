import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    confirmSecret: async (_, args) => {
      const { email, secret } = args;
      const existUser = prisma.$exists.user({ email });
      if (existUser) {
        const LS = await prisma.user({ email });
        if (LS.loginSecret === secret) {
          return "PUBLIC_TMP_KEY";
        }
        throw Error("wrong key answer");
      } else {
        throw Error("there is no user given email");
      }
    },
    requestSecret: async (_, args) => {
      const { email } = args;
      const existUser = await prisma.$exists.user({ email });
      if (existUser) {
        try {
          await prisma.updateUser({
            where: { email },
            data: { loginSecret: "pm" },
          });
          return "pm";
        } catch (error) {
          throw Error(error);
        }
      } else {
        throw Error("No User given Email.");
      }
    },
    requsetSecretEmail: async (_, args) => {
      const { email } = args;
      const existUser = await prisma.$exists.user({ email });
      if (existUser) {
        try {
          await prisma.updateUser({
            where: { email },
            data: { loginSecret: "pm" },
          });
          return true;
        } catch (error) {
          return false;
        }
      } else {
        return false;
      }
    },
  },
};
