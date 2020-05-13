import "./env";
import "./passport";
import { authenticateJWT } from "./passport";
import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";
import schema from "./scheme";
import cors from "cors";

const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request }),
});

server.express.use(cors());
server.express.use(logger("dev"));
server.express.use(authenticateJWT); // 람다 인자.

server.start({ port: PORT }, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
