import { prisma } from "../../../generated/prisma-client";

export default {
  User: {
    following: ({ id }) => prisma.user({ id }).following,
    followers: ({ id }) => prisma.user({ id }).followers,
  },
};
