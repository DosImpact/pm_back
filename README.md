# pm_back

# multer 부분

```js
npm install --save multer


```

# 이슈

```js
prisma.yml 의 데이터베이스 엔드포인트가 git에 노출되는 현상.
> 개발 단계에서는 : gitignore로 안보이게 하고
> 프로덕션 단계에서는 : env 설정을 통해, 감추자.
```

# 메일링 API 부분

```js
```

# computed Field

- Graph API 허점은, User정보의 Follower들 또한 User 정보이다. 그들의 User 정보의 Follower중에는 다시 내가 있을 수 있고, 이런 무한 재귀적인 쿼리는 매우매우 위험하다.
- 그래서 query 결과, 1 Depth만 준다.

- 1 Depth를 해결하는 방법은 3가지가 있다.

1. prisma.user({ id }).following

- prisma 서버에 요청할때 해당 필드만 명시

2. fragment라는것을 명시

3. computed Field 라는 graphql yoga의 기능을 이용

- 분명, user의 following 정보는 prisma가 안준다...
- 그러기 때문에 해당 빈 정보는 yoga서버가 더 찾아온다.
- computed-Field 는 이럴때 이용한다.

- 사실 yoga서버의 model.graphl에 맞게 prisma에 요청만 하면 되는거임.
- type User의 following정보는 한번에 처리를 못한다.
- 그러기에 resolver에 User라는 key로 두 정보를 해결해 준다.

```c#
type User {
  id: ID!
  name: String!
...
  following: [User!]!
  followers: [User!]!

}
```

```js
import { prisma } from "../../../generated/prisma-client";

export default {
  User: {
    following: ({ id }) => prisma.user({ id }).following,
    followers: ({ id }) => prisma.user({ id }).followers,
  },
};
```
