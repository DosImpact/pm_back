# pm_back

# 이슈

##

```js
이건 왜 설치했지?
- yarn add prisma-client-lib
```

```js
prisma.yml 의 데이터베이스 엔드포인트가 git에 노출되는 현상.
> 개발 단계에서는 : gitignore로 안보이게 하고
> 프로덕션 단계에서는 : env 설정을 통해, 감추자.
```

# passport 부분

```js
프레임
npm install passport

전략
npm install passport-local
npm install passport-google-oauth
npm install passport-jwt

보조 도구
npm install jsonwebtoken
```

## 알고리즘

- passport는 미들웨어로써, 작동한다.
- 인증 토큰이 들어오면, 알아서 디코딩하여, 인증됨을 req에 첨부해준다.
- 그렇지 않다면 , 흘려보냄 (req부분에 인증표시가 없음)

- 우선 JWT 토큰방식의 전략을 사용한다고 passport에 추가한다.
- passport도 미들웨어처럼 전략을 추가할 수 있다.
- JWT 옵션 ( header bearer | 비밀키 ) 및 해독결과 콜백
- 콜백함수에서 해독된 결과에 대한 판단, > done을 통해 결과통보.

- 이렇게 된성된 자체 미들웨어가 탑재된 passport를 express 미들웨어에 탑재한다.
- 결과는 req 에 넣어줘.

- 시크릿 키는
  [https://randomkeygen.com/](https://randomkeygen.com/) 을 참조

1. JWT 토큰 만들기

- jsonwebtoken의 sing은 암호화할 obj와, 비밀키를 두번째 인자로 넣어주면 결과 리턴
- 시크릿 키젠은
  [https://randomkeygen.com/](https://randomkeygen.com/) 을 참조

```js
import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
```

2. (어떤 과정을 잘 거쳐 사용자가 header bearar에 1번의 키를 넣었다.) passport 만들기

- 처음에 server 코드가 작동하기전에 passport도 초기화를 해주어야 한다.
- 전략 설정 > 초기화
- jwt전략을 passport.use에 미들웨어(처럼) 넣어준다.
- jwt전략은 options 과 verify 로 구성

- options : 토큰저장위치 설정 | 비밀키 설정
- verify(payload,done) : 두 인자로 구성

- payload : jwt이 잘 해독한 결과를 리턴한다. (만약 {id} 를 암호화했다면)
- 얻은 결과(id)

- done : jwt 의 해독한 결과가 맘에 드는지 리턴한다.
- id 을 통해 각자의 SQL에서 user정보를 꺼내자.
- done(null,user) : 이상없다, user 정보 리턴
- done(null,false) : 유저정보없다, false 리턴
- done(error,null) : DB에 에러가 생겼다.

- 잘 만들어진 passport를 미들웨어화 한다.
- passport.authenticate는 3번째 콜백으로 done()의 결과를 받는다.
- 그리고 람다를 리턴한다. > (req,res,next)로 계속 미들웨어 시행

```js
import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { prisma } from "../generated/prisma-client";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const verify = async (payload, done) => {
  try {
    const user = await prisma.user({ id: payload.id });
    if (user !== null) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error, null);
  }
};

export const authenticateJWT = (req, res, next) =>
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);

passport.use(new Strategy(opts, verify));
passport.initialize();
```

3. passport 미들웨어 장착

- GraphQL 서버는 context로 필요한 정보를 3번째 resolver인자로 전달해줄 수 있다.
- 여기서는 request 정보와, isAuth라는 단순히 request에 user정보가 있는지 판단하는 함수 제공
- server.express.use(authenticateJWT); // 람다 인자. 장착!

```js
import "./env";
import "./passport";
import { authenticateJWT } from "./passport";
import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";
import schema from "./scheme";
import cors from "cors";

import { isAuthenticated as isAuth } from "./middlewares";

const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request, isAuth }),
});

server.express.use(cors());
server.express.use(logger("dev"));
server.express.use(authenticateJWT); // 람다 인자.

server.start({ port: PORT }, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
-----
export const isAuthenticated = (request) => {
  if (!request.user) {
    throw Error("Need Logged in");
  }
  return true;
};
```

# 메일링 API 부분

```js
```
