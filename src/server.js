import { GraphQLServer } from "graphql-yoga";
import schema from "./scheme";
import naver from "./crwaling/naver";
import cors from "cors";

const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({
  schema,
});

server.express.use(cors());

server.express.get("/api", (req, res) => {
  res.json({ result: "success" });
  res.end();
});

server.express.get("/api/start", async (req, res) => {
  try {
    const result = await naver();
    res.json({ result: "success", data: result });
    res.end();
  } catch (error) {
    res.json({ result: "error" });
    res.end();
  }
});

server.start({ port: PORT }, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
