FROM node:alpine
WORKDIR /app/cryptolottery
COPY . .
RUN npm install
CMD npm run start
