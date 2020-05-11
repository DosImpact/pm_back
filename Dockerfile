FROM node:10.20.1-slim@sha256:79809f748c1de29269f1fffc212486a758412e4f0f0c79eaf99408245156a042

RUN mkdir -p /app
WORKDIR /app
ADD ./ /app



RUN npm install
RUN npm build

#배포버젼으로 설정 - 이 설정으로 환경을 나눌 수 있습니다.
ENV NODE_ENV=production

CMD node build/server

