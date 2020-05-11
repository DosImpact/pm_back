let fetchCNT = 0;

export default {
  Query: {
    hello: () => "HELLO GUI Crawling world",
    hello2: () => {
      fetchCNT += 1;
      return `HELLO 2 ${fetchCNT}`;
    },
    hello3: (_, args) => `HELLO 3 ${args.id}`,
    hello4: (_, args) =>
      ` HELLO 4 : id : ${args.id} yourname: ${
        args.name
      } your infos :  ${JSON.stringify(args.info)}`,
    hello5: (_, args) => {
      const { id, name, age, sex } = args;
      let sex_res = "";
      if (sex) {
        sex_res = sex;
      } else {
        sex_res = "unknown";
      }
      return {
        id: id + 1,
        name: `name : ${name}`,
        age: age + 100,
        sex: `${sex_res}`,
      };
    },
  },
};
