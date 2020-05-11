import ptNurlTag from "../../crwaling/ptNurlTag";

export default {
  Query: {
    NurlTag: async (_, args) => {
      const { tag, urls } = args;
      console.log("incomming Data", tag, urls);
      console.log("data incoming", tag, urls);
      const res = await ptNurlTag({ commonTag: tag, urls });
      console.log("res", res);
      return JSON.stringify(res);
    },
  },
};
