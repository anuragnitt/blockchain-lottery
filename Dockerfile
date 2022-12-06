FROM node:alpine

ARG USERNAME
ARG PASSWORD

RUN apk update && \
    apk add --no-cache --virtual npm npm && \
    useradd -m ${USERNAME} && \
    echo "${USERNAME}:${PASSWORD}" | chpasswd && \
    mkdir /home/${USERNAME}/cryptolottery && \
    chown -R ${USERNAME}: /home/${USERNAME}/cryptolottery

USER ${USERNAME}
WORKDIR /home/${USERNAME}/cryptolottery

COPY public src package.json package-lock.json ./

RUN npm install

CMD npm run start
