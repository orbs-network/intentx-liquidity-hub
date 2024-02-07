FROM node:16

RUN mkdir /cloverfield-v2
WORKDIR /cloverfield-v2
COPY . ./

RUN yarn install

COPY .env.example .env

EXPOSE 3000

CMD ["yarn" , "dev"]
