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

1. passport.js 기본설정

```

```

2. 완성된 passport 미들웨어 > express에 장착하기

```

```

# 메일링 API 부분

```js
```
